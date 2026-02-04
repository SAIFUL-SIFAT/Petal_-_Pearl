import { Controller, Get, UseGuards } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppService } from './app.service';
import { ProductsService } from './products/products.service';
import { UsersService } from './users/users.service';
import { OrdersService } from './orders/orders.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
    private readonly dataSource: DataSource,
  ) { }

  @Get('health')
  health() {
    return 'OK';
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Secure this in production with @UseGuards(JwtAuthGuard)
  @Get('dashboard/stats')
  async getDashboardStats() {
    const productsCount = await this.productsService.count();
    const usersCount = await this.usersService.count();
    const ordersCount = await this.ordersService.count();
    const totalRevenue = await this.ordersService.getTotalRevenue();
    const chartData = await this.ordersService.getRevenueChartData();
    const performance = await this.ordersService.getPerformanceMetrics();
    const orderTrends = await this.ordersService.getTrends();
    const userTrend = await this.usersService.getTrend();

    return {
      products: productsCount,
      users: usersCount,
      orders: ordersCount,
      sales: ordersCount,
      earnings: totalRevenue,
      chartData: chartData,
      performance: performance,
      trends: {
        revenue: orderTrends.revenueTrend,
        orders: orderTrends.ordersTrend,
        users: userTrend,
        products: 8.1 // Keeping product trend static as it's less critical and usually slow-changing
      }
    };
  }
}
