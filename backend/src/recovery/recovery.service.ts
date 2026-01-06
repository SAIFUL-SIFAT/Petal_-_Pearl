import { Injectable, Logger } from '@nestjs/common';
import { CartsService } from '../carts/carts.service';

@Injectable()
export class RecoveryService {
    private readonly logger = new Logger(RecoveryService.name);

    constructor(private readonly cartsService: CartsService) { }

    async sendAbandonedCartReminders() {
        this.logger.log('Checking for abandoned carts...');

        const abandonedCarts = await this.cartsService.getAbandonedCarts();

        this.logger.log(`Found ${abandonedCarts.length} abandoned carts to notify.`);

        for (const cart of abandonedCarts) {
            if (cart.user && cart.user.email) {
                await this.sendEmail(cart);
                await this.cartsService.markReminderSent(cart.id);
            }
        }

        return {
            processed: abandonedCarts.length,
            message: `Sent ${abandonedCarts.length} reminders.`
        };
    }

    private async sendEmail(cart: any) {
        // MOCK EMAIL SENDING
        this.logger.log(`--- SENDING EMAIL TO: ${cart.user.email} ---`);
        this.logger.log(`Subject: Wait! You forgot something beautiful...`);
        this.logger.log(`Body: Hello ${cart.user.name}, your bag at Petal & Pearl is waiting for you!`);
        this.logger.log(`Items: ${cart.items.map((i: any) => i.name).join(', ')}`);
        this.logger.log(`Total: ৳${cart.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)}`);
        this.logger.log(`-------------------------------------------`);

        // In a real app, use @nestjs-modules/mailer or similar
        return Promise.resolve();
    }
}
