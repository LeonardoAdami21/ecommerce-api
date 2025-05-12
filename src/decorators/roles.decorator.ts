import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (userRole: string[]) => SetMetadata(ROLES_KEY, userRole);
