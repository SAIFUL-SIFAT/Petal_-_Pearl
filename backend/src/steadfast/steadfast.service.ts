import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class SteadfastService {
    private readonly logger = new Logger(SteadfastService.name);
    private readonly baseUrl: string;
    private readonly apiKey: string;
    private readonly secretKey: string;

    constructor(private config: ConfigService) {
        // CORRECT Steadfast URLs
        this.baseUrl = this.config.get<string>('STEADFAST_BASE_URL') || 'https://portal.packzy.com/api/v1';
        this.apiKey = this.config.get<string>('STEADFAST_API_KEY') || '';
        this.secretKey = this.config.get<string>('STEADFAST_SECRET_KEY') || '';

        if (!this.apiKey || !this.secretKey) {
            this.logger.warn('Steadfast API credentials not configured');
        }
    }

    private getHeaders() {
        return {
            'Api-Key': this.apiKey,
            'Secret-Key': this.secretKey,
            'Content-Type': 'application/json',
        };
    }

    async createParcel(order: Order) {
        // Validate credentials
        if (!this.apiKey || !this.secretKey) {
            throw new Error('Steadfast API credentials not configured');
        }

        // Clean and validate phone
        const cleanedPhone = this.cleanPhoneNumber(order.customerPhone);

        // Prepare item description
        const itemDescription = order.items
            .map(item => `${item.name} (x${item.quantity})`)
            .join(', ');

        // Estimate weight (default 0.5kg for clothing/jewelry)
        const estimatedWeight = this.estimateWeight(order.items);

        // Build payload according to Steadfast API docs
        const payload = {
            invoice: `ORD-${order.id}`,
            recipient_name: order.customerName.trim(),
            recipient_phone: cleanedPhone,
            recipient_address: order.shippingAddress.trim(),
            recipient_city: this.extractCity(order.shippingAddress) || 'Dhaka',
            recipient_zone: this.extractArea(order.shippingAddress) || '',
            cod_amount: order.paymentMethod === 'cash_on_delivery'
                ? Math.round(Number(order.totalAmount))
                : 0,
            note: 'Fragile item. Handle with care.',
            item_type: this.getItemType(order.items), // 'Packet' or 'Box'
            weight: estimatedWeight,
            item_quantity: order.items.reduce((sum, item) => sum + item.quantity, 1),
            item_description: itemDescription.substring(0, 250),
            // Optional but recommended
            amount_to_collect: order.paymentMethod === 'cash_on_delivery'
                ? Math.round(Number(order.totalAmount))
                : 0,
            delivery_type: 1, // 1 for Regular, 2 for Express
            package_type: 'Packet', // Packet, Box, Document
            product_price: Math.round(Number(order.totalAmount)),
        };

        this.logger.log(`Creating Steadfast parcel for order #${order.id}`);

        try {
            const response = await axios.post(
                `${this.baseUrl}/create_order`,
                payload,
                {
                    headers: this.getHeaders(),
                    timeout: 30000, // 30 seconds timeout
                }
            );

            // SUCCESS: Check HTTP status 200-299
            if (response.status >= 200 && response.status < 300) {
                const data = response.data;

                // Some APIs return status 200 but include an error status in the body
                if (data.status && data.status !== 200) {
                    const errorMsg = data.message || JSON.stringify(data.errors) || 'Steadfast API returned an error';
                    this.logger.error(` Steadfast API error: ${errorMsg}`);
                    return {
                        success: false,
                        message: errorMsg,
                        rawResponse: data,
                    };
                }

                // Expected response structure from Steadfast
                if (data.consignment) {
                    this.logger.log(`Parcel created: ${data.consignment.tracking_code}`);

                    return {
                        success: true,
                        parcelId: data.consignment.consignment_id || data.consignment.id,
                        trackingCode: data.consignment.tracking_code,
                        trackingLink: `https://steadfast.com.bd/t/${data.consignment.tracking_code}`,
                        invoice: data.consignment.invoice,
                        cod: data.consignment.cod_amount,
                        status: data.consignment.status,
                        rawResponse: data,
                    };
                } else {
                    this.logger.warn(`Unexpected response structure: ${JSON.stringify(data)}`);
                    return {
                        success: false,
                        message: 'Parcel creation failed or unexpected response format',
                        rawResponse: data,
                    };
                }
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

        } catch (error: any) {
            this.logger.error(` Failed to create parcel for order #${order.id}`);

            // Log the actual error
            if (error.response) {
                // The request was made and the server responded with error
                this.logger.error(`Steadfast API Error ${error.response.status}:`, error.response.data);

                const errorMsg = error.response.data?.message ||
                    error.response.data?.error ||
                    `Steadfast API error: ${error.response.status}`;
                throw new Error(errorMsg);

            } else if (error.request) {
                // The request was made but no response received
                this.logger.error('No response from Steadfast:', error.request);
                throw new Error('Steadfast service is not responding. Please try again later.');

            } else {
                // Something happened in setting up the request
                this.logger.error('Request setup error:', error.message);
                throw new Error(`Failed to connect to Steadfast: ${error.message}`);
            }
        }
    }

    // Helper methods
    private cleanPhoneNumber(phone: string): string {
        // Remove all non-digits
        let cleaned = phone.replace(/\D/g, '');

        // Ensure it's a valid Bangladesh number
        if (cleaned.length === 11 && cleaned.startsWith('01')) {
            // Already in 01XXXXXXXXX format
            return cleaned;
        } else if (cleaned.length === 13 && cleaned.startsWith('8801')) {
            // In 8801XXXXXXXXX format, remove 880
            return cleaned.substring(3);
        } else if (cleaned.length === 10 && cleaned.startsWith('1')) {
            // In 1XXXXXXXXX format, add leading 0
            return `0${cleaned}`;
        } else {
            // Try to extract last 11 digits
            if (cleaned.length > 11) {
                cleaned = cleaned.slice(-11);
            }
            // Ensure it starts with 01
            if (!cleaned.startsWith('01') && cleaned.length === 11) {
                cleaned = `01${cleaned.slice(2)}`;
            }
            return cleaned;
        }
    }

    private estimateWeight(items: any[]): number {
        // Estimate weight based on product types
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

        // Rough estimates:
        // - Jewelry: 0.1kg per item
        // - Clothing: 0.3kg per item  
        // - Default: 0.2kg per item

        let totalWeight = 0;
        for (const item of items) {
            if (item.category?.toLowerCase().includes('jewelry')) {
                totalWeight += 0.1 * item.quantity;
            } else if (item.category?.toLowerCase().includes('clothing')) {
                totalWeight += 0.3 * item.quantity;
            } else {
                totalWeight += 0.2 * item.quantity;
            }
        }

        // Minimum 0.1kg, maximum 5kg for standard delivery
        return Math.min(Math.max(totalWeight, 0.1), 5.0);
    }

    private extractCity(address: string): string {
        const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur'];
        for (const city of cities) {
            if (address.toLowerCase().includes(city.toLowerCase())) {
                return city;
            }
        }
        return 'Dhaka'; // Default
    }

    private extractArea(address: string): string {
        // Common Dhaka areas
        const dhakaAreas = ['Uttara', 'Gulshan', 'Banani', 'Dhanmondi', 'Mirpur', 'Mohakhali', 'Motijheel'];
        for (const area of dhakaAreas) {
            if (address.toLowerCase().includes(area.toLowerCase())) {
                return area;
            }
        }
        return '';
    }

    private getItemType(items: any[]): string {
        // Determine if it's a packet or box based on items
        const hasClothing = items.some(item =>
            item.category?.toLowerCase().includes('dress') ||
            item.category?.toLowerCase().includes('clothing')
        );

        return hasClothing ? 'Box' : 'Packet';
    }

    // Tracking methods - IMPROVED
    async trackParcel(trackingCode: string) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/status_by_trackingcode/${trackingCode}`,
                { headers: this.getHeaders() }
            );

            return {
                success: true,
                status: response.data?.status || 'unknown',
                updates: response.data?.history || [],
                rawResponse: response.data,
            };
        } catch (error: any) {
            this.logger.error(`Failed to track ${trackingCode}:`, error.message);
            throw new Error(`Tracking failed: ${error.message}`);
        }
    }

    async checkBalance() {
        try {
            const response = await axios.get(
                `${this.baseUrl}/get_balance`,
                { headers: this.getHeaders() }
            );

            return {
                success: true,
                balance: response.data?.balance || 0,
                currency: 'BDT',
                rawResponse: response.data,
            };
        } catch (error: any) {
            this.logger.error('Failed to check balance:', error.message);
            throw new Error(`Balance check failed: ${error.message}`);
        }
    }

    // Cancel parcel if needed
    async cancelParcel(trackingCode: string) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/cancel_order`,
                { tracking_code: trackingCode },
                { headers: this.getHeaders() }
            );

            return {
                success: true,
                message: 'Parcel cancelled successfully',
                rawResponse: response.data,
            };
        } catch (error: any) {
            this.logger.error(`Failed to cancel ${trackingCode}:`, error.message);
            throw new Error(`Cancellation failed: ${error.message}`);
        }
    }
}
