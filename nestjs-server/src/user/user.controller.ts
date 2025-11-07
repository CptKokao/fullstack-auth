import { Controller, HttpCode, Get, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { Authorized } from '@/auth/decorators/authorized.decorator';
import { Authorization } from '@/auth/decorators/auth.decorator';
import { UserRoles } from 'drizzle/schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization(UserRoles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  public async findProfile(@Authorized('id') userId: string) {
    return this.userService.findById(userId);
  }
}
