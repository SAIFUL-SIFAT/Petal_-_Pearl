import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { SteadfastModule } from '../steadfast/steadfast.module';
import { MailingModule } from '../mailing/mailing.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, Product]),
        NotificationsModule,
        SteadfastModule,
        MailingModule,
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [OrdersService],
})
export class OrdersModule { }
