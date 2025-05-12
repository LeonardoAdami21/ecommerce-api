// src/products/products.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { forwardRef, NotFoundException } from '@nestjs/common';
import { PrismaConfigService } from '../config/prisma.config.service';
import { ProductRepository } from './prisma/product.repository';
import { productsProvider } from './provider/product.provider';
import { PrismaConfigModule } from '../config/prisma.config.module';
import { UsersModule } from '../users/users.module';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaConfigService;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaConfigModule, forwardRef(() => UsersModule)],
      providers: [ProductsService, ...productsProvider, ProductRepository],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated products ', async () => {
      const products = await service.findAll();
      expect(products).toBeDefined();
    });
    it('should return paginated products ', async () => {
      const skip = 0;
      const take = 10;
      const name = 'Smartphone XYZ';
      const maxPrice = 0;
      const minPrice = 0;
      const orderBy = '';
      const order = 'asc';
      const limit = 10;
      const page = 1;
      const products = await service.findAll(
        skip,
        take,
        name,
        minPrice,
        maxPrice,
        orderBy,
        order,
      );
      expect(products).toBeDefined();
    });
  });
  
  it('Should return one product', async () => {
    const id = 1;
    const product = await service.findOne(id);
    expect(product).toBeDefined();
  })
});
