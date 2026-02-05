import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdvertiserService } from '../advertiser/advertiser.service';
import { TossPaymentConfirmResponse } from './dto/toss-payment.dto';

const MIN_CHARGE_AMOUNT = 1000;
const MAX_CHARGE_AMOUNT = 10_000_000;

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly tossSecretKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly advertiserService: AdvertiserService
  ) {
    this.tossSecretKey =
      this.configService.get<string>('TOSS_SECRET_KEY') || '';

    if (!this.tossSecretKey) {
      this.logger.error('TOSS_SECRET_KEY가 설정되지 않았습니다!');
    }
  }

  async confirmPayment(
    userId: number,
    paymentKey: string,
    orderId: string,
    amount: number
  ): Promise<void> {
    // 금액 범위 검증
    if (amount < MIN_CHARGE_AMOUNT || amount > MAX_CHARGE_AMOUNT) {
      throw new BadRequestException(
        `충전 금액은 ${MIN_CHARGE_AMOUNT}원 이상, ${MAX_CHARGE_AMOUNT}원 이하여야 합니다`
      );
    }

    // 토스 API 결제 승인 요청
    const response = await fetch(
      'https://api.tosspayments.com/v1/payments/confirm',
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.tossSecretKey}:`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount,
        }),
      }
    );

    if (!response.ok) {
      const error = (await response.json()) as {
        message?: string;
        code?: string;
      };
      this.logger.error(`[토스 실패] orderId: ${orderId}, ${error.code}`);
      throw new BadRequestException(
        error.message || '결제 승인에 실패했습니다'
      );
    }

    const paymentData = (await response.json()) as TossPaymentConfirmResponse;

    // 금액 재검증
    if (paymentData.totalAmount !== amount) {
      this.logger.error(
        `[금액 불일치] orderId: ${orderId}, 요청: ${amount}, 토스: ${paymentData.totalAmount}`
      );
      throw new BadRequestException(
        '결제 금액이 일치하지 않습니다. 고객센터에 문의해주세요.'
      );
    }

    // 크레딧 충전
    if (paymentData.status === 'DONE') {
      await this.advertiserService.chargeCredit(userId, amount, '크레딧 충전');
      this.logger.log(`[결제 완료] userId: ${userId}, amount: ${amount}`);
    } else {
      throw new BadRequestException(
        `결제가 완료되지 않았습니다 (상태: ${paymentData.status})`
      );
    }
  }

  // 토스 Webhook 처리 (비동기 결제 상태 변경 알림)
  handleWebhook(paymentKey: string, orderId: string, status: string): void {
    this.logger.log(`[Webhook] orderId: ${orderId}, status: ${status}`);
    // TODO: orderId로 결제 정보 조회 및 상태 업데이트
  }
}
