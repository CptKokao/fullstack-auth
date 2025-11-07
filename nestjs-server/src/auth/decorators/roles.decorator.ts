import { SetMetadata } from '@nestjs/common';
import { User, UserRoles } from 'drizzle/schema';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles);
