import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthStrategies } from '../interfaces/auth.strategies';

@Injectable()
export class UserAuthGuard extends AuthGuard(AuthStrategies.USER) {}
