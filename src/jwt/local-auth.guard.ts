import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthStrategies } from '../interfaces/auth.strategies';

@Injectable()
export class LocalAuthGuard extends AuthGuard(AuthStrategies.LOCAL) {}
