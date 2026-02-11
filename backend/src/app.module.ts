import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { PayoutModule } from './payout/payout.module';
import { PrismaModule } from './prisma/prisma.module';
import { TelegramModule } from './telegram/telegram.module';
import { TonWalletModule } from './ton-wallet/ton-wallet.module';
import { UserModule } from './user/user.module';
import { UserPaymentModule } from './user-payment/user-payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    PaymentModule,
    TelegramModule,
    UserPaymentModule,
    TonWalletModule,
    PayoutModule,
  ],
})
export class AppModule {}
