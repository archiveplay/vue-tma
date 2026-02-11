import { Module } from '@nestjs/common';
import { TonWalletModule } from 'src/ton-wallet/ton-wallet.module';

import { PayoutController } from './payout.controller';
import { PayoutService } from './payout.service';

@Module({
  imports: [TonWalletModule],
  controllers: [PayoutController],
  providers: [PayoutService],
})
export class PayoutModule {}
