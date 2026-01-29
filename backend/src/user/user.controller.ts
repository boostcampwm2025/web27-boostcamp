import { Controller, Get, Post, Req } from '@nestjs/common';
import { type AuthenticatedRequest } from 'src/types/authenticated-request';
import { UserService } from './user.service';
import { successResponse } from 'src/common/response/success-response';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('me/first-login')
  async handleFirstLogin(@Req() req: AuthenticatedRequest) {
    const { userId } = req.user;
    const isFirstLogin = await this.userService.handleFirstLogin(userId);
    return successResponse(
      { isFirstLogin },
      '첫 로그인 여부가 성공적으로 체크되었습니다.'
    );
  }

  @Get('me')
  async getMe(@Req() req: AuthenticatedRequest) {
    const { userId, role, email } = req.user;
    const balance = await this.userService.getBalance(userId);
    return successResponse(
      { userId, role, email, balance },
      '로그인된 사용자 정보입니다.'
    );
  }
}
