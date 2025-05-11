// roles.guard.ts - Versão alternativa sem depender de JwtService injetado
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../../decorators/public.decorator';
import * as jwt from 'jsonwebtoken'; // Usar jsonwebtoken diretamente

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Verifica se a rota é pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Verifica se a rota tem roles requeridas
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    // Se não há roles requeridas, não precisa validar
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    // Extrai o token do header Authorization
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token não fornecido');
    }

    const token = authHeader.split(' ')[1];

    try {
      // Decodifica o token usando jsonwebtoken diretamente
      const payload: any = jwt.verify(token, process.env.JWT_SECRET);

      // Adiciona o usuário ao request para uso futuro
      request.user = payload;

      // Verifica se o usuário tem pelo menos uma das roles requeridas
      const userRole = payload.roles;

      // Se o usuário não tem role, nega o acesso
      if (!userRole) {
        return false;
      }

      // Verifica se o usuário tem permissão para acessar a rota
      return requiredRoles.includes(userRole as string);
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
