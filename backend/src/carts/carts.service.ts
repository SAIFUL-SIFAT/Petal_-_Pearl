import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartsService {
    private readonly logger = new Logger(CartsService.name);

    constructor(
        @InjectRepository(Cart)
        private cartsRepository: Repository<Cart>,
    ) { }

    async findByUser(userId: number) {
        return this.cartsRepository.findOne({ where: { userId } });
    }

    async updateCart(userId: number, items: any[]) {
        let cart = await this.findByUser(userId);

        if (!cart) {
            cart = this.cartsRepository.create({ userId, items });
        } else {
            cart.items = items;
            cart.reminderSent = false; // Reset reminder if they item cart
            cart.isRecovered = false;
        }

        return this.cartsRepository.save(cart);
    }

    async clearCart(userId: number) {
        const cart = await this.findByUser(userId);
        if (cart) {
            cart.items = [];
            cart.isRecovered = true;
            await this.cartsRepository.save(cart);
        }
    }

    // This would ideally be called by a CRON job
    async getAbandonedCarts() {
        // Find carts updated more than 24 hours ago that haven't had a reminder sent
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        return this.cartsRepository.find({
            where: {
                updatedAt: LessThan(twentyFourHoursAgo),
                reminderSent: false,
                isRecovered: false,
            },
            relations: ['user'],
        });
    }

    async markReminderSent(cartId: number) {
        await this.cartsRepository.update(cartId, { reminderSent: true });
    }
}
