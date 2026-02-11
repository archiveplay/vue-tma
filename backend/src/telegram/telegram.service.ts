import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly api: any;

  constructor(private readonly config: ConfigService) {
    const token = this.config.get<string>('BOT_TOKEN', '');
    this.api = axios.create({
      baseURL: `https://api.telegram.org/bot${token}`,
    });
  }

  async answerPreCheckoutQuery(queryId: string) {
    try {
      await this.api.post('/answerPreCheckoutQuery', {
        pre_checkout_query_id: queryId,
        ok: true,
      });
      this.logger.log(`PreCheckoutQuery ${queryId} answered`);
    } catch (err) {
      this.logger.error(`Failed to answer pre_checkout_query: ${err}`);
    }
  }
}
