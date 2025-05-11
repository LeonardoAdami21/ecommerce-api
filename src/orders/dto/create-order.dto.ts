import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsEnum,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderProductDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @ApiProperty({ type: [OrderProductDto] })
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  products: OrderProductDto[];

  @ApiProperty({
    enum: ['Pendente', 'Concluído', 'Cancelado'],
    default: 'Pendente',
  })
  @IsString()
  @IsEnum(['Pendente', 'Concluído', 'Cancelado'])
  @IsOptional()
  status?: string = 'Pendente';
}
