import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { PaymentStatus } from '../types/PaymentStatus';

export type PaymentCallback = (
  status: PaymentStatus,
  payload: ParsedPaymentPayload
) => Promise<void>;

export interface ParsedPaymentPayload {
  currency: string;
  amount: number;
}

export abstract class PaymentProviderBase {
  private callbacks = new Map<string, PaymentCallback>();

  /**
   * handleWebhook return payload/status
   */
  protected abstract parseWebhook(rawBody: any): {
    payload: ParsedPaymentPayload;
    status: PaymentStatus;
  } | null;

  abstract createInvoice(
    dto: CreateInvoiceDto,
    callback?: PaymentCallback
  ): Promise<{ url: string }>;

  protected registerCallback(
    status: PaymentStatus,
    callback?: PaymentCallback
  ) {
    if (callback) this.callbacks.set(status, callback);
  }

  private async callCallback(
    status: PaymentStatus,
    payload: ParsedPaymentPayload
  ) {
    const callback = this.callbacks.get(status);
    if (callback) {
      await callback(status, payload);
      this.callbacks.delete(status);
    }
  }

  async handleWebhook(rawBody: any) {
    const result = this.parseWebhook(rawBody);
    if (result) {
      const { status, payload } = result;
      await this.callCallback(status, payload);
    }
  }
}
