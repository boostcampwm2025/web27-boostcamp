import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly tossSecretKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
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
    // 1. 토스페이먼츠 API로 결제 승인 요청
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
      const error = (await response.json()) as { message?: string };
      this.logger.error('토스페이먼츠 결제 승인 실패', error);
      throw new BadRequestException(
        error.message || '결제 승인에 실패했습니다'
      );
    }

    const paymentData = (await response.json()) as { status: string };
    this.logger.log(`결제 승인 성공 - status: ${paymentData.status}`);

    // 2. 결제 성공 시 크레딧 충전
    if (paymentData.status === 'DONE') {
      await this.userService.chargeCredit(userId, amount);
      this.logger.log(
        `크레딧 충전 완료 - userId: ${userId}, amount: ${amount}`
      );
    } else {
      throw new BadRequestException('결제가 완료되지 않았습니다');
    }
  }
}
