import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
    ) { }

    async create(createOrderDto: CreateOrderDto, userId: number) {
        // Calculate total amount
        const totalAmount = createOrderDto.items.reduce(
            (sum, item) => sum + (item.price * item.quantity),
            0
        );

        const order = this.ordersRepository.create({
            ...createOrderDto,
            userId,
            totalAmount,
            status: 'pending',
        });

        return this.ordersRepository.save(order);
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
}
