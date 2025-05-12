import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsPositive,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Smartphone XYZ',
    description: 'Product name',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Electronics',
    description: 'Product category',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example: 'Latest model with great features',
    description: 'Product description',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 999.99,
    default: 0,
    description: 'Product price',
    type: Number,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 100,
    description: 'Product quantity stock',
    type: Number,
  })
  @IsNumber()
  @Min(0)
  quantity_stock: number;
}
