import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { PRODUCT__REPOSITORY } from '../provider/product.provider';

@Injectable()
export class ProductRepository {
  constructor(
    @Inject(PRODUCT__REPOSITORY)
    private readonly productRepository: PrismaClient['product'],
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { name, category, description, price, quantity_stock } =
        createProductDto;
      if (!name || !category || !description || !price || !quantity_stock) {
        throw new BadRequestException('All fields are required');
      }
      return await this.productRepository.create({
        data: {
          name,
          category,
          description,
          price,
          quantity_stock,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error creating product', error);
    }
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
    const where: any = {};

    if (name) {
      where.name = {
        contains: name,
      };
    }

    if (minPrice || maxPrice) {
      where.price = {};

      if (minPrice) {
        where.price.gte = minPrice;
      }

      if (maxPrice) {
        where.price.lte = maxPrice;
      }
    }

    const orderByParam: any = {};
    if (orderBy) {
      orderByParam[orderBy] = order || 'asc';
    } else {
      orderByParam.id = 'asc';
    }

    const totalCount = await this.productRepository.count({ where });

    const products = await this.productRepository.findMany({
      where,
      skip,
      take,
      orderBy: orderByParam,
    });

    return {
      data: products,
      meta: {
        total: totalCount,
        page: skip ? Math.floor(skip / take) + 1 : 1,
        pageSize: take || totalCount,
      },
    };
  }

  async findOne(id: number) {
    try {
      const product = await this.productRepository.findUnique({
        where: { id },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      return product;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving the product',
      );
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const { name, category, description, price, quantity_stock } =
        updateProductDto;

      if (!name || !category || !description || !price || !quantity_stock) {
        throw new BadRequestException('All fields are required');
      }
      const product = await this.productRepository.findUnique({
        where: { id },
      });
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return await this.productRepository.update({
        where: { id },
        data: {
          name,
          category,
          description,
          price,
          quantity_stock,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      const product = await this.productRepository.findUnique({
        where: { id },
      });
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      await this.productRepository.delete({
        where: { id },
      });
      return {
        message: 'Product deleted successfully',
      };
    } catch (error) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async checkStock(productId: number, quantity: number) {
    const product = await this.findOne(productId);
    return product.quantity_stock >= quantity;
  }

  async updateStock(productId: number, quantity: number) {
    const product = await this.findOne(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    const newStock = product.quantity_stock - quantity;

    if (newStock < 0) {
      throw new ConflictException(
        `Not enough stock for product ${product.name}`,
      );
    }

    return this.productRepository.update({
      where: { id: productId },
      data: { quantity_stock: newStock },
    });
  }
}
