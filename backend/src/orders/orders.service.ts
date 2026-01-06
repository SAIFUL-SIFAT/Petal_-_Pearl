import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { SteadfastService } from '../steadfast/steadfast.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        private notificationsService: NotificationsService,
        private steadfastService: SteadfastService,
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

        // Send to Steadfast
        const steadfastResponse = await this.steadfastService.createParcel(order);

        order.courier = 'steadfast';
        order.courierConsignmentId = steadfastResponse.consignment_id;
        order.courierStatus = 'created';
        order.status = 'confirmed';

        return this.ordersRepository.save(order);
    }

}
