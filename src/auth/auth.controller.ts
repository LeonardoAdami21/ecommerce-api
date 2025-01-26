import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication and Authorization')
export class AuthController {
  constructor() {}
}
