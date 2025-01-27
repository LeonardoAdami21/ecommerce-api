import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthStrategies } from '../interfaces/auth.strategies';
import { AuthService } from '../auth/auth.service';
import { User } from '../users/providers/user.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  AuthStrategies.LOCAL,
) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException({ message: 'Unauthorized' });
    }
    return user;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
