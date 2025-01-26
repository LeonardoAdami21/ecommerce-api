import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    type: String,
    description: 'Email of the user',
    required: true,
    example: 'O2HdK@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'Password of the user',
    required: true,
    example: 'password',
  })
  @IsNotEmpty()
  password: string;
}
