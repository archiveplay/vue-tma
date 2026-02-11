import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

import { PaymentProviderBase, PaymentCallback } from './payment-provider.base';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { PaymentStatus } from '../types/PaymentStatus';

const CRYPTOBOT_API = {
  test: 'https://testnet-pay.crypt.bot/',
  main: 'https://pay.crypt.bot/',
};

@Injectable()
export class CryptoBotProvider extends PaymentProviderBase {
  private readonly axios: AxiosInstance;
  private logger = new Logger(CryptoBotProvider.name);

  constructor(private readonly config: ConfigService) {
    super();

    const mode = this.config.get<string>('MODE') || 'main';
    const apiUrl = CRYPTOBOT_API[mode];

    const token = this.config.get<string>(
      `TG_CRYPTOBOT_PROVIDER_TOKEN${mode === 'test' ? '_TEST' : ''}`
    );

    this.logger.log(
      `Cryptobot provider working in ${mode}net and requesting ${apiUrl}`
    );

    this.axios = axios.create({
      baseURL: apiUrl,
      timeout: 5000,
      headers: {
        'Crypto-Pay-API-Token': token,
        'Content-Type': 'application/json',
      },
    });
  }

  async createInvoice(dto: CreateInvoiceDto, callback?: PaymentCallback) {
    this.registerCallback(PaymentStatus.PAID, callback);

    const {
      data: { ok, result },
    } = await this.axios.post('api/createInvoice', {
      asset: dto.currency,
      amount: dto.amount,
      description: dto.description,
    });

    if (!ok) throw new Error('Create invoice error');

    return result;
  }

  protected parseWebhook(rawBody: any) {
    const payload = rawBody.payload;
    return {
      status: payload.status as PaymentStatus,
      payload: {
        currency: payload.asset,
        amount: payload.amount,
      },
    };
  }
}
