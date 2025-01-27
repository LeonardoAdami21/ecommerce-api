import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { UserService } from '../users/user.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(forwardRef(() => ProductsService))
    private productsService: ProductsService,
  ) {}
  async create(createCartDto: CreateCartDto, userId: string) {
    try {
      const { productId } = createCartDto;
      const user = await this.userService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const existingItem = user.cartItems?.find(
        (item) => item.product.toString() === productId.toString(),
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        user.cartItems?.push({ product: productId, quantity: 1 } as any);
      }
      await user.save();
      return user.cartItems;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(userId: string) {
    try {
      const user = await this.userService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const products = await this.productsService.findProdByUserId(userId);
      const cartItems = products.map((product) => {
        const item = user.cartItems?.find(
          (cartItem) => cartItem.product.toString() === product._id.toString(),
        );
        return {
          ...product.toJSON(),
          quantity: item?.quantity,
        };
      });
      return cartItems;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    userId: string,
    updateCartDto: UpdateCartDto,
    productId: string,
  ) {
    try {
      const user = await this.userService.findUserById(userId);
      const product = await this.productsService.findById(productId);
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      const { quantity } = updateCartDto;
      if (quantity <= 0) {
        throw new BadRequestException('Quantity must be greater than 0');
      }
      const existingItem = user.cartItems?.find(
        (item) => item.product.toString() === productId,
      );
      if (existingItem) {
        if (quantity === 0) {
          user.cartItems = user.cartItems?.filter(
            (item) => item.product.toString() !== productId,
          );
        }
        existingItem.quantity = quantity;
        await user.save();
        return user.cartItems;
      } else {
        throw new NotFoundException('Product not found');
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async removeAllProductsFromCart(dto: CreateCartDto, userId: string) {
    try {
      const { productId } = dto;
      const user = await this.userService.findUserById(userId);
      if (!productId) {
        user.cartItems = [];
      } else {
        user.cartItems = user.cartItems?.filter(
          (item) => item.product.toString() !== productId.toString(),
        );
      }
      await user.save();
      return user.cartItems;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
