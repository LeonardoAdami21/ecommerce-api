import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    type: String,
    description: 'Name of the product',
    required: true,
    example: 'Product 1',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'Description of the product',
    required: true,
    example: 'This is a product',
  })
  description: string;
  @ApiProperty({
    type: Number,
    description: 'Price of the product',
    required: true,
    example: 9.99,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    type: String,
    description: 'Category of the product',
    required: true,
    example: 'Electronics',
  })
  category: string;
}
