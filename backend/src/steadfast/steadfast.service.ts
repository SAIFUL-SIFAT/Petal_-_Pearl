import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class SteadfastService {
    private baseUrl: string;
    private apiKey: string;
    private secret: string;

    constructor(private config: ConfigService) {
        // Updated Base URL from documentation
        this.baseUrl = this.config.get<string>('STEADFAST_BASE_URL') || 'https://portal.packzy.com/api/v1';
        this.apiKey = this.config.get<string>('STEADFAST_API_KEY') || '';
        this.secret = this.config.get<string>('STEADFAST_SECRET') || '';
    }

    private getHeaders() {
        return {
            'Api-Key': this.apiKey,
            'Secret-Key': this.secret,
            'Content-Type': 'application/json',
        };
    }

    async createParcel(order: Order) {
        // Prepare item description from order items
        const itemDescription = order.items
            .map(item => `${item.name} (x${item.quantity})`)
            .join(', ');

        // Clean phone number: remove non-digits and ensure 11 digits
        let cleanedPhone = order.customerPhone.replace(/\D/g, '');
        if (cleanedPhone.length > 11) {
            // If it starts with 880, take last 11 digits
            if (cleanedPhone.startsWith('880')) {
                cleanedPhone = cleanedPhone.slice(-11);
            } else {
                cleanedPhone = cleanedPhone.substring(0, 11);
            }
        }

        const payload = {
            invoice: `ORD-${order.id}`,
            recipient_name: order.customerName,
            recipient_phone: cleanedPhone,
            recipient_address: order.shippingAddress,
            recipient_email: order.customerEmail,
            cod_amount: order.paymentMethod === 'cash_on_delivery'
                ? Math.round(Number(order.totalAmount))
                : 0,
            note: 'Deliver with care.',
            item_description: itemDescription.substring(0, 250),
        };

        try {
            const res = await axios.post(
                `${this.baseUrl}/create_order`,
                payload,
                {
                    headers: this.getHeaders(),
                    timeout: 15000,
                },
            );

            // According to documentation, status 200 is success
            if (res.data?.status !== 200) {
                throw new Error(res.data?.message || 'Steadfast API returned an error');
            }

            return res.data;
        } catch (error: any) {
            console.error('Steadfast Error Payload:', payload);
            console.error('Steadfast Error Response:', error.response?.data || error.message);

            if (error.response?.status >= 500) {
                throw new Error('Steadfast Courier service is currently unavailable (Server Error)');
            }
            if (error.code === 'ECONNABORTED') {
                throw new Error('Connection to Steadfast timed out. Please try again later.');
            }
            const errorMsg = error.response?.data?.message || error.message || 'Failed to connect to Steadfast';
            throw new Error(errorMsg);
        }
    }

    // New tracking methods based on documentation
    async getStatusByCid(id: string) {
        const res = await axios.get(`${this.baseUrl}/status_by_cid/${id}`, {
            headers: this.getHeaders(),
        });
        return res.data;
    }

    async getStatusByInvoice(invoice: string) {
        const res = await axios.get(`${this.baseUrl}/status_by_invoice/${invoice}`, {
            headers: this.getHeaders(),
        });
        return res.data;
    }

    async getStatusByTrackingCode(trackingCode: string) {
        const res = await axios.get(`${this.baseUrl}/status_by_trackingcode/${trackingCode}`, {
            headers: this.getHeaders(),
        });
        return res.data;
    }

    async getBalance() {
        const res = await axios.get(`${this.baseUrl}/get_balance`, {
            headers: this.getHeaders(),
        });
        return res.data;
    }
}

