import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../interfaces/user.role';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) return false;

    const payload = this.jwtService.decode(token) as any;

    const roles = payload.profile
      ? payload.profile
      : payload.student.user.profile;

    if (roles.includes(UserRole.ADMIN)) return true;

    if (requiredRoles.some((role) => roles?.includes(role))) {
      return true;
    }
    throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
  }
}
