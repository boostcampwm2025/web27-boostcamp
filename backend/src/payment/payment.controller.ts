import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtCookieGuard } from '../auth/guards/jwt-cookie.guard';
import type { AuthenticatedRequest } from '../types/authenticated-request';
import { successResponse } from '../common/response/success-response';

@Controller('payments')
@UseGuards(JwtCookieGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('confirm')
  async confirmPayment(
    @Req() req: AuthenticatedRequest,
    @Body() body: { paymentKey: string; orderId: string; amount: number }
  ) {
    const { userId } = req.user;
    const { paymentKey, orderId, amount } = body;

    await this.paymentService.confirmPayment(
      userId,
      paymentKey,
      orderId,
      amount
    );

    return successResponse(null, '결제가 완료되었습니다');
  }
}
