import { Module } from '@nestjs/common';
import { RecoveryService } from './recovery.service';
import { RecoveryController } from './recovery.controller';
import { CartsModule } from '../carts/carts.module';

@Module({
    imports: [CartsModule],
    controllers: [RecoveryController],
    providers: [RecoveryService],
})
export class RecoveryModule { }
