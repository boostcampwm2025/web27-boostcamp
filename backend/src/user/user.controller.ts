import { Controller, Post, Req } from '@nestjs/common';
import { type AuthenticatedRequest } from 'src/types/authenticated-request';

@Controller('users')
export class UserController {
  @Post('me/first-login')
  checkFirstLogin(@Req() req: AuthenticatedRequest) {}
}
