import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
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
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Request } from 'express';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
@ApiTags('Products')
@Controller('v2/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['admin'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiCreatedResponse({ description: 'Product created successfully.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  create(@Body() createProductDto: CreateProductDto, @Req() req: Request) {
    return this.productsService.create(createProductDto, req.user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all products with filtering, pagination and sorting',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'orderBy', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  @ApiOkResponse({ description: 'Products retrieved successfully.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('name') name?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('orderBy') orderBy?: string,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    const skip = (page - 1) * limit;
    return this.productsService.findAll(
      skip,
      limit,
      name,
      minPrice,
      maxPrice,
      orderBy,
      order,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiOkResponse({ description: 'Product retrieved successfully.' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product' })
  @ApiOkResponse({ description: 'Product updated successfully.' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product' })
  @ApiOkResponse({ description: 'Product deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
