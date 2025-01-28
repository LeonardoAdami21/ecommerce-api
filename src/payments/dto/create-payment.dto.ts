import { ApiProperty } from '@nestjs/swagger';

export class Products {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  file: string;
}

export class CreatePaymentDto {
  @ApiProperty({
    type: [Products],
    description: 'Array of products',
    examples: [{ productid: '123', quantity: 1, price: 9.99 }],
  })
  products: Products[];

  @ApiProperty({
    type: String,
    description: 'Coupon code',
  })
  couponCode: string;
}
