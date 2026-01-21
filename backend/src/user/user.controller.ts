import { Controller, Post, Req } from '@nestjs/common';
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
}
