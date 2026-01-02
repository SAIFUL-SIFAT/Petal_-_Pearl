import { IsNotEmpty, IsString, IsEmail, IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
    @IsNumber()
    productId: number;

    @IsString()
    name: string;

    @IsNumber()
    price: number;

    @IsNumber()
    quantity: number;

    @IsString()
    image: string;
}

export class CreateOrderDto {
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @IsNotEmpty()
    @IsString()
    shippingAddress: string;

    @IsNotEmpty()
    @IsString()
    customerName: string;

    @IsNotEmpty()
    @IsEmail()
    customerEmail: string;

    @IsNotEmpty()
    @IsString()
    customerPhone: string;

    @IsNotEmpty()
    @IsString()
    paymentMethod: 'cash_on_delivery' | 'bkash' | 'nagad' | 'bank_transfer';

    @IsString()
    transactionId?: string;
}
