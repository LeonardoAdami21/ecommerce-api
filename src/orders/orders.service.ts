import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersRepository } from './prisma/order.repository';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: number) {
    try {
      const user = await this.usersService.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return this.ordersRepository.create(createOrderDto, userId);
    } catch (error) {
      throw new InternalServerErrorException('Error creating order', error);
    }
  }

  async findAll(userId: number, skip?: number, take?: number, status?: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const orders = this.ordersRepository.findAll(userId, skip, take, status);
    return orders;
  }

  async findOne(id: number, userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const order = this.ordersRepository.findOne(id, userId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async updateStatus(id: number, status: string, userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const order = this.ordersRepository.updateStatus(id, status, userId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }
}
