import { Controller, Post, Req } from '@nestjs/common';
import { type AuthenticatedRequest } from 'src/types/authenticated-request';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('me/first-login')
  async handleFirstLogin(@Req() req: AuthenticatedRequest) {
    const { userId } = req.user;
    await this.userService.handleFirstLogin(userId);
  }
}
