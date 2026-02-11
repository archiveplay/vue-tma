import { Module } from '@nestjs/common';
import { TelegramModule } from 'src/telegram/telegram.module';

import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { CryptoBotProvider } from './providers/cryptobot.provider';
import { StarsProvider } from './providers/stars.provider';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, StarsProvider, CryptoBotProvider],
  imports: [TelegramModule],
  exports: [PaymentService],
})
export class PaymentModule {}
