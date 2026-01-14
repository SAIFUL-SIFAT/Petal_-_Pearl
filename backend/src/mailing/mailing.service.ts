import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';

@Injectable()
export class MailingService {
    private readonly logger = new Logger(MailingService.name);
    private isEnabled = false;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('SENDGRID_API_KEY');

        if (!apiKey) {
            this.logger.warn('SENDGRID_API_KEY not set. Email service will be disabled.');
            return;
        }

        sgMail.setApiKey(apiKey);
        this.isEnabled = true;
        this.logger.log('SendGrid service initialized');
    }

    async sendOrderNotification(order: any) {
        if (!this.isEnabled) {
            this.logger.warn('SendGrid not enabled. Skipping order notification.');
            return;
        }

        const recipients = ['sifat.sai3@gmail.com', 'shahela17@gmail.com'];
        const subject = `New Order #${order.id} - Petal & Pearl`;

        const fromEmail = this.configService.get<string>('SENDGRID_FROM') ||
            this.configService.get<string>('SMTP_FROM') ||
            'sifat.sai3@gmail.com';

        const itemsList = order.items.map((item: any) =>
            `<li>${item.name} x ${item.quantity} - ৳${item.price * item.quantity}</li>`
        ).join('');

        const html = `
            <div style="font-family: sans-serif; color: #333;">
                <h1>New Order Received!</h1>
                <p>A new order has been placed on Petal & Pearl.</p>
                <hr />
                <h2>Order Details:</h2>
                <ul>
                    <li><strong>Order ID:</strong> #${order.id}</li>
                    <li><strong>Customer Name:</strong> ${order.customerName}</li>
                    <li><strong>Email:</strong> ${order.customerEmail}</li>
                    <li><strong>Phone:</strong> ${order.customerPhone}</li>
                    <li><strong>Total Amount:</strong> ৳${order.totalAmount}</li>
                </ul>
                <h3>Items:</h3>
                <ul>${itemsList}</ul>
                <p>Please log in to the admin panel to process this order.</p>
            </div>
        `;

        const msg = {
            to: recipients,
            from: fromEmail,
            subject: subject,
            html: html,
        };

        try {
            this.logger.log(`Attempting to send order notification for #${order.id} to ${recipients.join(', ')}...`);

            // Send to each recipient individually to ensure better delivery tracking
            const sendPromises = recipients.map(recipient =>
                sgMail.send({
                    ...msg,
                    to: recipient
                })
            );

            await Promise.all(sendPromises);
            this.logger.log(`Order notification email sent successfully for order #${order.id}`);
        } catch (error: any) {
            this.logger.error(`CRITICAL: SendGrid Failure for order #${order.id}. Error: ${error.message}`);
            if (error.response) {
                this.logger.error(JSON.stringify(error.response.body));
            }
        }
    }

    async sendEmail(options: { to: string; subject: string; html: string }) {
        if (!this.isEnabled) {
            this.logger.warn('SendGrid not enabled. Skipping email send.');
            return;
        }

        const fromEmail = this.configService.get<string>('SENDGRID_FROM') ||
            this.configService.get<string>('SMTP_FROM') ||
            'sifat.sai3@gmail.com';

        const msg = {
            to: options.to,
            from: fromEmail,
            subject: options.subject,
            html: options.html,
        };

        try {
            await sgMail.send(msg);
            this.logger.log(`Email sent successfully to ${options.to}`);
        } catch (error: any) {
            this.logger.error(`Failed to send email to ${options.to}: ${error.message}`);
            if (error.response) {
                this.logger.error(JSON.stringify(error.response.body));
            }
        }
    }
}

