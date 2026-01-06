import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CartsService } from './carts.service';

@Controller('carts')
export class CartsController {
    constructor(private readonly cartsService: CartsService) { }

    @Get(':userId')
    findByUser(@Param('userId') userId: string) {
        return this.cartsService.findByUser(+userId);
    }

    @Post(':userId')
    updateCart(@Param('userId') userId: string, @Body('items') items: any[]) {
        return this.cartsService.updateCart(+userId, items);
    }
}
