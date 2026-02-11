import { Injectable } from '@nestjs/common';
import { CurrencyType } from 'src/common/types/currency.enum';
import { TonWalletService } from 'src/ton-wallet/ton-wallet.service';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PayoutService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tonWalletService: TonWalletService
  ) {}

  async sendToCreator(
    creatorId: number,
    amount: number,
    currency: CurrencyType
  ) {
    const creator = await this.prisma.user.findUnique({
      where: { id: creatorId },
    });

    if (!creator?.tonWallet) {
      throw new Error('Creator wallet not set');
    }

    const txHash = await this.tonWalletService.send(
      creator.tonWallet,
      currency,
      amount
    );

    const withdrawal = await this.prisma.withdrawal.create({
      data: {
        userId: creator.id,
        amount,
        asset: currency,
        status: 'done',
        txHash,
      },
    });

    return withdrawal;
  }
}
