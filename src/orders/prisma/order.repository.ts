import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { ORDER__REPOSITORY } from '../provider/order.provider';
import { PrismaClient } from '@prisma/client';
import { ProductsService } from '../../products/products.service';
import { PrismaConfigService } from '../../config/prisma.config.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class OrdersRepository {
  constructor(
    @Inject(ORDER__REPOSITORY)
    private readonly orderRepository: PrismaClient['order'],
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
    private readonly prisma: PrismaConfigService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Verificar produtos e quantidades
    const productItems = createOrderDto.products || [];

    // Verificar se todos os produtos existem e têm estoque suficiente
    for (const item of productItems) {
      const product = await this.productsService.findOne(item.productId);
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.productId} not found`,
        );
      }

      if (product.quantity_stock < item.quantity) {
        throw new BadRequestException(
          `Not enough stock for product ${product.name}. Available: ${product.quantity_stock}, Requested: ${item.quantity}`,
        );
      }
    }

    // Calcular valor total do pedido
    let totalAmount = 0;
    const orderProducts = [];

    for (const item of productItems) {
      const product = await this.productsService.findOne(item.productId);
      totalAmount += Number(product.price) * item.quantity;

      orderProducts.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Criar pedido com transação
    try {
      return await this.prisma.$transaction(async (prisma) => {
        // Criar pedido
        const order = await this.orderRepository.create({
          data: {
            total_amount: totalAmount,
            status: 'Pendente',
            products: {
              create: orderProducts.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
              })),
            },
          },
          include: {
            products: {
              include: {
                product: true,
              },
            },
          },
          
        });

        // Atualizar estoque se o pedido for criado com sucesso
        if (createOrderDto.status === 'Concluído') {
          for (const item of orderProducts) {
            const product = await this.productsService.findOne(item.productId);

            await prisma.product.update({
              where: { id: item.productId },
              data: {
                quantity_stock: product.quantity_stock - item.quantity,
              },
            });
          }

          // Atualizar status do pedido
          await this.orderRepository.update({
            where: { id: order.id },
            data: { status: 'Concluído' },
          });
        }

        return order;
      }, {
        timeout: 30000
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while creating the order',
        error,
      );
    }
  }

  async findAll(userId: number, skip?: number, take?: number, status?: string) {
    const where: any = {};

    if (status) {
      where.status = status;
    }

    const totalCount = await this.orderRepository.count({ where });

    const orders = await this.orderRepository.findMany({
      where,
      skip,
      take,
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      data: orders,
      meta: {
        total: totalCount,
        page: skip ? Math.floor(skip / take) + 1 : 1,
        pageSize: take || totalCount,
      },
    };
  }

  async findOne(id: number, userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const order = await this.orderRepository.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

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
    const order = await this.orderRepository.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (order.status === status) {
      return order;
    }

    // Se o status for alterado para "Concluído", atualizar o estoque
    if (status === 'Concluído' && order.status !== 'Concluído') {
      return this.prisma.$transaction(async (prisma) => {
        // Atualizar estoque de cada produto
        for (const item of order.products) {
          const product = await this.productsService.findOne(item.productId);
          if (!product) {
            throw new NotFoundException(
              `Product with ID ${item.productId} not found`,
            );
          }

          await prisma.product.update({
            where: { id: item.productId },
            data: {
              quantity_stock: product.quantity_stock - item.quantity,
            },
          });
        }

        // Atualizar status do pedido
        return this.orderRepository.update({
          where: { id },
          data: { status },
          include: {
            products: {
              include: {
                product: true,
              },
            },
          },
        });
      });
    }

    // Se o status for alterado de "Concluído" para outro, reverter o estoque
    if (status !== 'Concluído' && order.status === 'Concluído') {
      return this.prisma.$transaction(async (prisma) => {
        // Atualizar estoque de cada produto
        for (const item of order.products) {
          const product = await this.productsService.findOne(item.productId);

          await prisma.product.update({
            where: { id: item.productId },
            data: {
              quantity_stock: product.quantity_stock + item.quantity,
            },
          });
        }

        // Atualizar status do pedido
        return this.orderRepository.update({
          where: { id },
          data: { status },
          include: {
            products: {
              include: {
                product: true,
              },
            },
          },
        });
      });
    }

    // Caso contrário, apenas atualizar o status
    return this.orderRepository.update({
      where: { id },
      data: { status },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}
