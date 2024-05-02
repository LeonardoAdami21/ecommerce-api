import { ApiProperty } from '@nestjs/swagger';
import { UserEnumType } from '../schema/user.schema';

export class RegisterUserDto {
  @ApiProperty({
    example: 'User',
    description: 'Name of the user',
    required: true,
  })
  name: string;
  @ApiProperty({
    example: '12345678901 or 1234567890123',
    description: 'Document CPF or CNPJ of the user',
    required: true,
  })
  document: string;
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

  @ApiProperty({
    example: '123456',
    description: 'Password of the user',
    required: true,
  })
  passwordConfirmation: string;

  confirmationToken?: string;

  recoveryToken?: string;

  role?: UserEnumType;
}
