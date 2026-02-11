import { Injectable, NotFoundException } from '@nestjs/common';
import { CurrencyType } from '@prisma/client';
import { TelegramUserDto } from 'src/auth/dto/telegram-user.dto';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async setWallet(userId: number, address: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { tonWallet: address },
    });
  }

  async findOrCreate(dto: TelegramUserDto) {
    const user = await this.prisma.user.upsert({
      where: { id: dto.id },
      update: {
        ...dto,
        last_login: new Date(),
      },
      create: {
        ...dto,
        last_login: new Date(),
      },
    });

    const existingBalances = await this.prisma.userBalance.findMany({
      where: { ownerId: user.id },
    });

    if (existingBalances.length === 0) {
      const currencies = Object.values(CurrencyType);

      const balancesData = currencies.map((currency) => ({
        ownerId: user.id,
        currency,
        amount: 0,
      }));
      await this.prisma.userBalance.createMany({
        data: balancesData,
      });
    }

    return user;
  }

  async getProfile(id: number) {
    const dbUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!dbUser) throw new NotFoundException('User not found');

    return dbUser;
  }

  async incrementBalance(
    telegramUserId: number,
    amount: number,
    currency: CurrencyType
  ) {
    const result = await this.prisma.userBalance.update({
      where: {
        ownerId_currency: {
          ownerId: telegramUserId,
          currency: currency,
        },
      },
      data: {
        amount: { increment: amount },
      },
    });

    return result;
  }

  async getUserBalances(userId: number): Promise<Record<CurrencyType, number>> {
    const balances = await this.prisma.userBalance.findMany({
      where: { ownerId: userId },
    });

    const result: Record<CurrencyType, number> = Object.values(
      CurrencyType
    ).reduce(
      (acc, currency) => {
        acc[currency] = 0;
        return acc;
      },
      {} as Record<CurrencyType, number>
    );

    balances.forEach((b) => {
      result[b.currency] = b.amount;
    });

    return result;
  }
}
