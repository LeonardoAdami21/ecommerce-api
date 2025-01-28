import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { UserService } from '../users/user.service';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => ProductsService))
    private productsService: ProductsService,
    @Inject(forwardRef(() => PaymentsService))
    private paymentsService: PaymentsService,
  ) {}

  async getAnalyticsData() {
    const totalUsers = await this.userService.totalUsers();
    const totalProducts = await this.productsService.totalProducts();
    const salesData = await this.paymentsService.totalSalesData();

    const { totalSales, totalRevenue } = salesData[0] || {
      totalSales: 0,
      totalRevenue: 0,
    };

    return {
      users: totalUsers,
      products: totalProducts,
      totalSales,
      totalRevenue,
    };
  }

  async getDatesInRange(startDate: Date, endDate: Date) {
    const dates: any = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  async getDailySalesData(startDate: Date, endDate: Date) {
    try {
      const dailySalesData = await this.paymentsService.getSalesData(
        startDate,
        endDate,
      );

      const dateArray = await this.getDatesInRange(startDate, endDate);
      // console.log(dateArray) // ['2024-08-18', '2024-08-19', ... ]

      return dateArray.map((date) => {
        const foundData = dailySalesData.find((item) => item._id === date);

        return {
          date,
          sales: foundData?.sales || 0,
          revenue: foundData?.revenue || 0,
        };
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
