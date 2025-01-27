import { ApiProperty } from '@nestjs/swagger';

export class CreateCartDto {
  @ApiProperty({
    type: String,
    description: 'Id of the product',
    required: true,
  })
  productId: string;
}
