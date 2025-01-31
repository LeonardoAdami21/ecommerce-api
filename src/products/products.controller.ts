import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../strategy/roles.decorator';
import { UserRole } from '../interfaces/user.role';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @Post()
  @ApiBody({
    description: 'Create a new product',

    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        price: {
          type: 'number',
        },
        category: {
          type: 'string',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1024 * 1024 * 10, // 10MB
      },
    }),
  )
  @ApiOperation({ summary: 'Create a new product' })
  @ApiCreatedResponse({ description: 'Product created successfully' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(createProductDto, file);
  }

  @ApiBearerAuth()
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Find all products' })
  @ApiOkResponse({ description: 'Products found successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @ApiOperation({ summary: 'Find featured products' })
  @ApiOkResponse({ description: 'Featured products found successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Get('featured')
  getFeaturedPrducts() {
    return this.productsService.getFeaturedPrducts();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find products by category' })
  @ApiOkResponse({ description: 'Products found successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Get(':category')
  findAllProductsByCategory(@Param('category') category: string) {
    return this.productsService.findAllProductsByCategory(category);
  }

  @ApiBearerAuth()
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Find recommended products' })
  @ApiOkResponse({ description: 'Recommended products found successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Get('recommendations')
  getRecommendedProducts() {
    return this.productsService.getRecommendedProducts();
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a product' })
  @ApiOkResponse({ description: 'Product updated successfully' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Patch(':id')
  update(@Param('id') id: string) {
    return this.productsService.toggleFeaturedProduct(id);
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiOkResponse({ description: 'Product deleted successfully' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}
