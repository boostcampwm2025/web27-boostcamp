// 토스페이먼츠 API 응답 타입 정의
// https://docs.tosspayments.com/reference#payment-%EA%B0%9D%EC%B2%B4
export interface TossPaymentConfirmResponse {
  version: string;
  paymentKey: string;
  type: string;
  orderId: string;
  orderName: string;
  mId: string;
  currency: string;
  method: string;
  totalAmount: number;
  balanceAmount: number;
  status:
    | 'READY'
    | 'IN_PROGRESS'
    | 'WAITING_FOR_DEPOSIT'
    | 'DONE'
    | 'CANCELED'
    | 'PARTIAL_CANCELED'
    | 'ABORTED'
    | 'EXPIRED';
  requestedAt: string;
  approvedAt: string;
  useEscrow: boolean;
  lastTransactionKey: string | null;
  suppliedAmount: number;
  vat: number;
  cultureExpense: boolean;
  taxFreeAmount: number;
  taxExemptionAmount: number;
  cancels: any[] | null;
  isPartialCancelable: boolean;
  card?: {
    amount: number;
    issuerCode: string;
    acquirerCode: string;
    number: string;
    installmentPlanMonths: number;
    approveNo: string;
    useCardPoint: boolean;
    cardType: string;
    ownerType: string;
    acquireStatus: string;
    isInterestFree: boolean;
    interestPayer: string | null;
  };
  virtualAccount?: any;
  transfer?: any;
  mobilePhone?: any;
  giftCertificate?: any;
  cashReceipt?: any;
  cashReceipts?: any;
  discount?: any;
  secret?: string;
  type_?: string;
  easyPay?: any;
  country: string;
  failure?: {
    code: string;
    message: string;
  };
  isPartialCancelable_?: boolean;
  receipt?: {
    url: string;
  };
  checkout?: {
    url: string;
  };
  metadata?: Record<string, string>;
}

/**
 * 토스페이먼츠 Webhook 페이로드
 */
export interface TossWebhookPayload {
  eventType: 'PAYMENT_STATUS_CHANGED';
  createdAt: string;
  data: {
    paymentKey: string;
    orderId: string;
    status: TossPaymentConfirmResponse['status'];
    totalAmount: number;
  };
}
