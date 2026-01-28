import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtCookieGuard } from '../auth/guards/jwt-cookie.guard';
import type { AuthenticatedRequest } from '../types/authenticated-request';
import { successResponse } from '../common/response/success-response';
import type { TossWebhookPayload } from './dto/toss-payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('confirm')
  @UseGuards(JwtCookieGuard)
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

  // 토스 Webhook: 인증 없이 토스 서버에서 호출
  @Post('webhook')
  handleWebhook(@Body() payload: TossWebhookPayload) {
    if (payload.eventType === 'PAYMENT_STATUS_CHANGED') {
      this.paymentService.handleWebhook(
        payload.data.paymentKey,
        payload.data.orderId,
        payload.data.status
      );
    }

    return successResponse(null, 'Webhook 처리 완료');
  }
}
