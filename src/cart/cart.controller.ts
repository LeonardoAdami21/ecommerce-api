import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Put,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '../strategy/roles.decorator';
import { UserRole } from '../interfaces/user.role';
import { RequestUser } from '../interfaces/request.user';

@Controller('cart')
@ApiBearerAuth()
@ApiTags('Cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Add product to cart' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @Post()
  create(@Body() createCartDto: CreateCartDto, @Request() req: { user: { _id: string } }) {
    return this.cartService.create(createCartDto, req.user._id);
  }

  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Get all products from cart' })
  @ApiOkResponse({ description: 'Products retrieved successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @Get()
  findAll(@Request() req: { user: { _id: string } }) {
    return this.cartService.findAll(req.user._id);
  }

  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Update product quantity from cart' })
  @ApiOkResponse({ description: 'Product quantity updated successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Put(':productId')
  update(
    @Param('productId') productId: string,
    @Body() updateCartDto: UpdateCartDto,
    @Request() req: { user: { _id: string } },
  ) {
    return this.cartService.update(req.user._id, updateCartDto, productId);
  }

  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Remove all products from cart' })
  @ApiOkResponse({ description: 'Products removed successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete('')
  remove(@Body() dto: CreateCartDto, @Request() req: { user: { _id: string } }) {
    return this.cartService.removeAllProductsFromCart(dto, req.user._id);
  }
}
