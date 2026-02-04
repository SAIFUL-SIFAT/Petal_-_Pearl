import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Not, In, MoreThanOrEqual, LessThan, And } from 'typeorm';
import { Order } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { SteadfastService } from '../steadfast/steadfast.service';
import { NotificationsService } from '../notifications/notifications.service';
import { MailingService } from '../mailing/mailing.service';

@Injectable()
export class OrdersService {
    private readonly logger = new Logger(OrdersService.name);

    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        private notificationsService: NotificationsService,
        private steadfastService: SteadfastService,
        private mailingService: MailingService,
        private dataSource: DataSource,
    ) { }

    async create(createOrderDto: CreateOrderDto, userId?: number | null) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Calculate total amount and check stock
            let totalAmount = 0;

            for (const item of createOrderDto.items) {
                // Fetch product with pessimistic write lock to avoid race conditions
                const product = await queryRunner.manager.findOne(Product, {
                    where: { id: item.productId },
                    lock: { mode: 'pessimistic_write' },
                });

                if (!product) {
                    throw new BadRequestException(`Product with ID ${item.productId} not found`);
                }

                if (product.stock < item.quantity) {
                    throw new BadRequestException(`Insufficient stock for product: ${product.name}. Available: ${product.stock}`);
                }

                // Decrement stock
                product.stock -= item.quantity;
                await queryRunner.manager.save(product);

                totalAmount += item.price * item.quantity;
            }

            // Determine initial status based on payment method
            const status = createOrderDto.paymentMethod === 'cash_on_delivery' ? 'confirmed' : 'pending';

            const order = queryRunner.manager.create(Order, {
                ...createOrderDto,
                userId,
                totalAmount,
                status,
                paymentStatus: 'pending',
                transactionId: createOrderDto.transactionId || null,
            });

            const savedOrder = await queryRunner.manager.save(order);

            // Create notification for admin
            await this.notificationsService.create({
                message: `New order #${savedOrder.id} placed by ${savedOrder.customerName}`,
                orderId: savedOrder.id,
            });

            await queryRunner.commitTransaction();

            // Send email notification to admins (async, don't block response)
            this.mailingService.sendOrderNotification(savedOrder).catch(err =>
                console.error('Failed to send order email notification:', err)
            );

            return savedOrder;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async findAll() {
        return this.ordersRepository.find({
            relations: ['user'],
            order: { createdAt: 'DESC' }
        });
    }

    async findByUser(userId: number) {
        return this.ordersRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });
    }

    async findOne(id: number) {
        return this.ordersRepository.findOne({
            where: { id },
            relations: ['user']
        });
    }

    async updateStatus(id: number, status: string) {
        await this.ordersRepository.update(id, { status: status as any });
        return this.findOne(id);
    }

    async updatePaymentStatus(id: number, paymentStatus: string) {
        await this.ordersRepository.update(id, { paymentStatus: paymentStatus as any });
        return this.findOne(id);
    }

    async count() {
        return this.ordersRepository.count();
    }

    async getTotalRevenue() {
        const result = await this.ordersRepository
            .createQueryBuilder('order')
            .select('SUM(order.totalAmount)', 'total')
            .where('order.status != :status', { status: 'cancelled' })
            .getRawOne();

        return parseFloat(result.total) || 0;
    }

    async confirmOrder(orderId: number) {
        const order = await this.ordersRepository.findOne({ where: { id: orderId } });

        if (!order) throw new Error('Order not found');

        try {
            // Send to Steadfast
            const steadfastResult = await this.steadfastService.createParcel(order);

            if (steadfastResult.success) {
                order.courier = 'steadfast';
                order.courierConsignmentId = steadfastResult.parcelId?.toString() ?? null;
                order.trackingCode = steadfastResult.trackingCode ?? null;
                order.trackingLink = steadfastResult.trackingLink ?? null;
                order.courierStatus = (steadfastResult as any).status ?? null;
                order.status = 'confirmed';

                const savedOrder = await this.ordersRepository.save(order);

                // Send tracking email to customer (async)
                this.sendTrackingEmail(savedOrder, steadfastResult).catch(err =>
                    this.logger.error(`Failed to send tracking email: ${err.message}`)
                );

                return savedOrder;
            } else {
                throw new Error(steadfastResult.message || 'Unknown courier error');
            }
        } catch (error: any) {
            this.logger.error(`Failed to create courier parcel for order #${order.id}: ${error.message}`);
            throw new BadRequestException(`Courier Error: ${error.message}`);
        }
    }

    async sendTrackingEmail(order: Order, tracking: any) {
        const html = `
            <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                <h2 style="color: #d4af37;">Your Order is on the Way! 🚚</h2>
                <p>Hello ${order.customerName},</p>
                <p>Great news! Your order <strong>#${order.id}</strong> has been shipped via <strong>Steadfast Courier</strong>.</p>
                
                <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Tracking Code:</strong> ${tracking.trackingCode}</p>
                    <p style="margin: 5px 0;"><strong>Invoice:</strong> ${tracking.invoice}</p>
                    <p style="margin: 5px 0;"><strong>COD Amount:</strong> ৳${tracking.cod}</p>
                </div>

                <p>You can track your parcel in real-time here:</p>
                <p style="text-align: center;">
                    <a href="${tracking.trackingLink}" style="display: inline-block; background: #d4af37; color: #fff; padding: 10px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Track Your Order</a>
                </p>
                
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #888;">Thank you for shopping with Petal & Pearl Boutique!</p>
            </div>
        `;

        await this.mailingService.sendEmail({
            to: order.customerEmail,
            subject: `Your Order #${order.id} - Tracking Information`,
            html,
        });
    }

    async syncStatus(orderId: number) {
        const order = await this.ordersRepository.findOne({ where: { id: orderId } });
        if (!order || order.courier !== 'steadfast' || !order.trackingCode) {
            return order;
        }

        try {
            const res = await this.steadfastService.trackParcel(order.trackingCode);
            if (res.success) {
                order.courierStatus = res.status;
                // Map statuses
                if (res.status === 'delivered') {
                    order.status = 'delivered';
                    order.paymentStatus = 'paid';
                } else if (res.status === 'cancelled') {
                    order.status = 'cancelled';
                }
                return await this.ordersRepository.save(order);
            }
        } catch (error: any) {
            this.logger.error(`Failed to sync status for order ${order.id}:`, error.message);
        }
        return order;
    }

    async getRevenueChartData() {
        const last6Months: { date: Date; name: string; sales: number }[] = [];
        const now = new Date();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            last6Months.push({
                date: d,
                name: months[d.getMonth()],
                sales: 0
            });
        }

        const startDate = last6Months[0].date;

        const orders = await this.ordersRepository
            .createQueryBuilder('order')
            .select("DATE_TRUNC('month', order.createdAt)", 'month')
            .addSelect('SUM(order.totalAmount)', 'sales')
            .where('order.status != :status', { status: 'cancelled' })
            .andWhere('order.createdAt >= :startDate', { startDate })
            .groupBy("DATE_TRUNC('month', order.createdAt)")
            .getRawMany();

        return last6Months.map(m => {
            const orderData = orders.find(o => {
                const orderDate = new Date(o.month);
                return orderDate.getMonth() === m.date.getMonth() &&
                    orderDate.getFullYear() === m.date.getFullYear();
            });
            return {
                name: m.name,
                sales: orderData ? parseFloat(orderData.sales) : 0
            };
        });
    }

    async getPerformanceMetrics() {
        // 1. Monthly Goal Progress (Target: 100,000)
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const currentMonthRevenue = await this.ordersRepository
            .createQueryBuilder('order')
            .select('SUM(order.totalAmount)', 'total')
            .where('order.status != :status', { status: 'cancelled' })
            .andWhere('order.createdAt >= :startOfMonth', { startOfMonth })
            .getRawOne();

        const revenue = parseFloat(currentMonthRevenue.total) || 0;
        const target = 100000; // Hardcoded target for now
        const targetProgress = Math.min(Math.round((revenue / target) * 100), 100);

        // 2. Order Fulfillment Rate
        const totalOrders = await this.ordersRepository.count({
            where: { status: Not('cancelled') }
        });

        const fulfilledOrders = await this.ordersRepository.count({
            where: { status: In(['shipped', 'delivered']) }
        });

        const fulfillmentRate = totalOrders > 0
            ? Math.round((fulfilledOrders / totalOrders) * 100)
            : 0;

        return {
            targetProgress,
            fulfillmentRate
        };
    }

    async getTrends() {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));

        // Revenue Trends
        const currentRevenueRaw = await this.ordersRepository
            .createQueryBuilder('order')
            .select('SUM(order.totalAmount)', 'total')
            .where('order.status != :status', { status: 'cancelled' })
            .andWhere('order.createdAt >= :startDate', { startDate: thirtyDaysAgo })
            .getRawOne();

        const previousRevenueRaw = await this.ordersRepository
            .createQueryBuilder('order')
            .select('SUM(order.totalAmount)', 'total')
            .where('order.status != :status', { status: 'cancelled' })
            .andWhere('order.createdAt >= :startDate', { startDate: sixtyDaysAgo })
            .andWhere('order.createdAt < :endDate', { endDate: thirtyDaysAgo })
            .getRawOne();

        const currentRevenue = parseFloat(currentRevenueRaw.total) || 0;
        const previousRevenue = parseFloat(previousRevenueRaw.total) || 0;

        // Order Trends
        const currentOrders = await this.ordersRepository.count({
            where: {
                status: Not('cancelled'),
                createdAt: MoreThanOrEqual(thirtyDaysAgo)
            }
        });

        const previousOrders = await this.ordersRepository.count({
            where: {
                status: Not('cancelled'),
                createdAt: And(MoreThanOrEqual(sixtyDaysAgo), LessThan(thirtyDaysAgo))
            }
        });

        const calculateTrend = (current: number, previous: number) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };

        return {
            revenueTrend: calculateTrend(currentRevenue, previousRevenue),
            ordersTrend: calculateTrend(currentOrders, previousOrders)
        };
    }

    async remove(id: number) {
        const order = await this.findOne(id);
        if (!order) throw new BadRequestException('Order not found');
        return this.ordersRepository.remove(order);
    }
}
