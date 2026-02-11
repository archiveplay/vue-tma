import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import BN from 'bn.js';
import { Address, internal, TonClient, WalletContractV3R2 } from 'ton';

@Injectable()
export class TonClientProvider {
  private appWallet: WalletContractV3R2;
  private secretKey: Uint8Array;

  constructor(
    private readonly client: TonClient,
    private readonly config: ConfigService
  ) {
    const publicKeyHex = this.config.get<string>('APP_WALLET_PUBLIC')!;
    const secretKeyHex = this.config.get<string>('APP_WALLET_SECRET')!;

    this.secretKey = Buffer.from(secretKeyHex, 'hex');

    this.appWallet = WalletContractV3R2.create({
      workchain: 0,
      publicKey: Buffer.from(publicKeyHex, 'hex'),
    });
  }

  async getSeqno(): Promise<number> {
    const wallet = this.client.open(this.appWallet);
    const seqno = await wallet.getSeqno();
    if (seqno === null) throw new Error('Wallet not deployed');
    return seqno;
  }

  async send(to: string, amount: number): Promise<string> {
    const wallet = this.client.open(this.appWallet);
    const seqno = await this.getSeqno();

    const messages = [
      internal({
        to: Address.parse(to),
        value: new BN(amount).toString(), // nanoTON
      }),
    ];

    const transfer = wallet.createTransfer({
      seqno,
      secretKey: Buffer.from(this.secretKey),
      messages,
    });

    await this.client.sendExternalMessage(this.appWallet, transfer);
    return transfer.hash().toString('hex');
  }
}
