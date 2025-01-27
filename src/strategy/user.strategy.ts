import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthStrategies } from '../interfaces/auth.strategies';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserStrategy extends PassportStrategy(
  Strategy,
  AuthStrategies.USER,
) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string) {
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }
    return user;
  }
}
