import { Module } from '@nestjs/common';
import { PaymentModule } from 'src/payment/payment.module';
import { UserModule } from 'src/user/user.module';

import { UserPaymentController } from './user-payment.controller';
import { UserPaymentService } from './user-payment.service';

@Module({
  imports: [UserModule, PaymentModule],
  controllers: [UserPaymentController],
  providers: [UserPaymentService],
})
export class UserPaymentModule {}
