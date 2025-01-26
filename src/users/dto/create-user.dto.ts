import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, isNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    type: String,
    required: true,
    example: 'John Doe',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    type: String,
    required: true,
    example: 'O2HdK@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    type: String,
    required: true,
    example: 'password',
  })
  @IsNotEmpty()
  password: string;
}
