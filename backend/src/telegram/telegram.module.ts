import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';

import { TelegramService } from './telegram.service';

@Module({
  imports: [UserModule],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
