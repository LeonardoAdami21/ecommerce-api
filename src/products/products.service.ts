import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './prisma/product.repository';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: ProductRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async create(createProductDto: CreateProductDto, userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.productRepository.create(createProductDto, userId);
  }

  async findAll(
    skip?: number,
    take?: number,
    name?: string,
    minPrice?: number,
    maxPrice?: number,
    orderBy?: string,
    order?: 'asc' | 'desc',
  ) {
    return await this.productRepository.findAll(
      skip,
      take,
      name,
      minPrice,
      maxPrice,
      orderBy,
      order,
    );
  }

  async findOne(id: number) {
    return await this.productRepository.findOne(id);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return await this.productRepository.update(id, updateProductDto);
  }

  async remove(id: number) {
    return await this.productRepository.remove(id);
  }

  async checkStock(productId: number, quantity: number) {
    return await this.productRepository.checkStock(productId, quantity);
  }

  async updateStock(productId: number, quantity: number) {
    return await this.productRepository.updateStock(productId, quantity);
  }
}
