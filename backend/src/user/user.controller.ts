import { Controller, Get, Post, Req, Body, Query } from '@nestjs/common';
import { type AuthenticatedRequest } from 'src/types/authenticated-request';
import { UserService } from './user.service';
import { successResponse } from 'src/common/response/success-response';
import { ChargeCreditDto, GetCreditHistoryDto } from './types/credit.dto';

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

  @Post('me/credit/charge')
  async chargeCredit(
    @Req() req: AuthenticatedRequest,
    @Body() body: ChargeCreditDto
  ) {
    const { userId } = req.user;
    const { amount } = body;

    const result = await this.userService.chargeCredit(userId, amount);

    return successResponse(
      {
        balanceAfter: result.balanceAfter,
        amount,
        historyId: result.historyId,
      },
      '크레딧이 충전되었습니다'
    );
  }

  @Get('me/credit/history')
  async getCreditHistory(
    @Req() req: AuthenticatedRequest,
    @Query() query: GetCreditHistoryDto
  ) {
    const { userId } = req.user;
    const limit = query.limit || 20;
    const offset = query.offset || 0;

    const result = await this.userService.getCreditHistory(
      userId,
      limit,
      offset
    );

    return successResponse(result, '크레딧 사용 내역 조회 성공');
  }
}
