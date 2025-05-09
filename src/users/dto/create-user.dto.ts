import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'User name',
    required: true,
  })
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Xb6K8@example.com',
    description: 'User email',
    required: true,
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'password',
    description: 'User password',
    required: true,
  })
  password: string;
}
