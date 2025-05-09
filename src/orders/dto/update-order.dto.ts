import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: ['Pendente', 'Concluído', 'Cancelado'] })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['Pendente', 'Concluído', 'Cancelado'])
  status: string;
}
