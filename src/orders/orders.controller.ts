import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Request } from 'express';

@Controller('v2/orders')
@ApiTags('Orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['user'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create order' })
  @ApiCreatedResponse({ description: 'Order created successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    console.log(createOrderDto.products);
    return this.ordersService.create(createOrderDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['user', 'admin'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find all orders' })
  @ApiOkResponse({ description: 'Orders found successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @Get()
  findAll(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('status') status?: string,
  ) {
    const skip = (page - 1) * limit;
    return this.ordersService.findAll(req.user.id, skip, limit, status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['user'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find one order' })
  @ApiOkResponse({ description: 'Order found successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.ordersService.findOne(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['user', 'admin'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order status' })
  @ApiOkResponse({ description: 'Order status updated successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Patch(':id/status')
  updateStatus(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto.status, req.user.id);
  }
}
