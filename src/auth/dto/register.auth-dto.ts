import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterAuthDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'User name',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'john.doe@gmail.com',
    description: 'User email',
    required: true,
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456789@Leo',
    description: 'User password',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  password: string;
}
