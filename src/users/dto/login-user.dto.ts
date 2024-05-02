import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    example: 'jhondev@gmail.com',
    description: 'Email of the user',
    required: true,
  })
  email: string;
  @ApiProperty({
    example: '123456',
    description: 'Password of the user',
    required: true,
  })
  password: string;
}
