import { ApiProperty } from '@nestjs/swagger';

export class CreateCouponDto {
  @ApiProperty({
    type: String,
    description: 'Code of the coupon',
    required: true,
  })
  code: string;

  @ApiProperty({
    type: Number,
    description: 'Discount percentage of the coupon',
    required: true,
  })
  discountPercentage: number;

  @ApiProperty({
    type: Date,
    description: 'Expiration date of the coupon',
    required: true,
  })
  expirationDate: Date;
}
