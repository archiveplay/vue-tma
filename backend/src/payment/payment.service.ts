import { Injectable } from '@nestjs/common';

import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CryptoBotProvider } from './providers/cryptobot.provider';
import { PaymentCallback } from './providers/payment-provider.base';
import { PaymentProviderType } from './providers/payment-provider.enum';
import { StarsProvider } from './providers/stars.provider';

@Injectable()
export class PaymentService {
  constructor(
    private starsProvider: StarsProvider,
    private cryptoProvider: CryptoBotProvider
  ) {}

  async createInvoice(dto: CreateInvoiceDto, callback?: PaymentCallback) {
    switch (dto.provider) {
      case PaymentProviderType.Stars:
        return this.starsProvider.createInvoice(dto, callback);
      case PaymentProviderType.CryptoBot:
        return this.cryptoProvider.createInvoice(dto, callback);
      default:
        throw new Error(`Unknown provider: ${dto.provider}`);
    }
  }

  async handleWebhook(provider: PaymentProviderType, rawBody) {
    switch (provider) {
      case PaymentProviderType.Stars:
        return this.starsProvider.handleWebhook(rawBody);
      case PaymentProviderType.CryptoBot:
        return this.cryptoProvider.handleWebhook(rawBody);
    }
  }
}
