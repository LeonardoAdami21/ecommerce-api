import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../interfaces/user.role';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
