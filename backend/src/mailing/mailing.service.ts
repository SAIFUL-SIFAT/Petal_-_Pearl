import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailingService {
    private readonly logger = new Logger(MailingService.name);
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST'),
            port: this.configService.get('SMTP_PORT', 587),
            secure: this.configService.get('SMTP_SECURE', false),
            auth: {
                user: this.configService.get('SMTP_USER'),
                pass: this.configService.get('SMTP_PASS'),
            },
        });
    }

    async sendOrderNotification(order: any) {
        const recipients = ['shahela17@gmail.com', 'sifat.sai3@gmail.com'];

        const subject = `New Order #${order.id} - Petal & Pearl`;

        // Create items list for email
        const itemsList = order.items.map((item: any) =>
            `<li>${item.name} x ${item.quantity} - ৳${item.price * item.quantity}</li>`
        ).join('');

        const html = `
      <h1>New Order Received!</h1>
      <p>A new order has been placed on Petal & Pearl.</p>
      <h2>Order Details:</h2>
      <ul>
        <li><strong>Order ID:</strong> #${order.id}</li>
        <li><strong>Customer Name:</strong> ${order.customerName}</li>
        <li><strong>Email:</strong> ${order.customerEmail}</li>
        <li><strong>Phone:</strong> ${order.customerPhone}</li>
        <li><strong>Shipping Address:</strong> ${order.shippingAddress}</li>
        <li><strong>Payment Method:</strong> ${order.paymentMethod}</li>
        <li><strong>Total Amount:</strong> ৳${order.totalAmount}</li>
      </ul>
      <h3>Items:</h3>
      <ul>
        ${itemsList}
      </ul>
      <p>Please log in to the admin panel to process this order.</p>
    `;

        try {
            await this.transporter.sendMail({
                from: this.configService.get('SMTP_FROM', '"Petal & Pearl" <noreply@petalpearl.com>'),
                to: recipients.join(', '),
                subject,
                html,
            });
            this.logger.log(`Order notification email sent for order #${order.id}`);
        } catch (error) {
            this.logger.error(`Failed to send order notification email for order #${order.id}:`, error);
        }
    }
}
