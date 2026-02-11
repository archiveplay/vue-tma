import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { TelegramService } from 'src/telegram/telegram.service';

import { PaymentProviderBase, PaymentCallback } from './payment-provider.base';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { PaymentStatus } from '../types/PaymentStatus';

@Injectable()
export class StarsProvider extends PaymentProviderBase {
  constructor(
    private readonly config: ConfigService,
    private telegramService: TelegramService
  ) {
    super();
  }

  async createInvoice(dto: CreateInvoiceDto, callback?: PaymentCallback) {
    this.registerCallback(PaymentStatus.PAID, callback);

    const botToken = this.config.get<string>('BOT_TOKEN');

    const response = await axios.post(
      `https://api.telegram.org/bot${botToken}/createInvoiceLink`,
      {
        title: dto.title,
        description: dto.description,
        payload: dto.payload,
        provider_token: '',
        currency: 'XTR',
        prices: [
          {
            label: dto.title,
            amount: dto.amount,
          },
        ],
      }
    );

    return {
      url: response.data.result as string,
    };
  }

  protected parseWebhook(update: any) {
    if (update.pre_checkout_query) {
      this.telegramService.answerPreCheckoutQuery(update.pre_checkout_query.id);
      return null;
    }

    if (update.message?.successful_payment) {
      const payment = update.message.successful_payment;
      return {
        payload: {
          currency: payment.currency,
          amount: payment.total_amount,
        },
        status: 'paid' as PaymentStatus,
      };
    }

    return null;
  }
}
