import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthDto {
  @ApiProperty({
    example: 'john.doe@gmail.com',
    description: 'User email',
    required: true
  })
  email: string;

  @ApiProperty({
    example: '123456789@Leo',
    description: 'User password',
    required: true,
  })
  password: string;
}
