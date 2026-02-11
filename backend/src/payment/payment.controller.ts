import {
  Controller,
  Post,
  Body,
  Param,
  Logger,
  HttpCode,
} from '@nestjs/common';

import { PaymentService } from '../payment/payment.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { PaymentProviderType } from './providers/payment-provider.enum';

@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-link')
  async createInvoice(@Body() dto: CreateInvoiceDto) {
    return this.paymentService.createInvoice(dto);
  }

  @Post('webhook/:provider')
  @HttpCode(200)
  async webhook(
    @Param('provider')
    provider: PaymentProviderType,
    @Body() rawBody: any
  ) {
    this.logger.log(`Webhook received for provider=${provider}`);

    await this.paymentService.handleWebhook(provider, rawBody);

    return { ok: true };
  }
}
