import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCartDto } from './create-cart.dto';

export class UpdateCartDto {
  @ApiProperty({
    type: Number,
    description: 'Quantity of the product',
    required: true,
  })
  quantity: number;
}
