import { PaymentProviderType } from '../providers/payment-provider.enum';

export class CreateInvoiceDto {
  provider: PaymentProviderType;
  title: string;
  description: string;
  payload: string;
  amount: number;
}
