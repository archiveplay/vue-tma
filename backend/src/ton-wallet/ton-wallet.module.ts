import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TonClient } from 'ton';

import { TonClientProvider } from './providers/ton-client.provider';
import { TonWalletService } from './ton-wallet.service';

@Global()
@Module({
  providers: [
    TonWalletService,
    TonClientProvider,
    {
      provide: TonClient,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return new TonClient({
          endpoint:
            config.get<string>('TON_API_ENDPOINT') ??
            'https://testnet.toncenter.com/api/v2/jsonRPC',
          timeout: 20000,
          apiKey: config.get<string>('TONCENTER_API_KEY'),
        });
      },
    },
  ],
  exports: [TonClient, TonWalletService],
})
export class TonWalletModule {}
