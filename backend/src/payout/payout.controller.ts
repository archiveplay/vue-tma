import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtUserDto } from 'src/auth/dto/jwt-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { User } from 'src/common/decorators/user.decorator';
import { CurrencyType } from 'src/common/types/currency.enum';

import { PayoutService } from './payout.service';

@Controller('payout')
export class PayoutController {
  constructor(private readonly payoutService: PayoutService) {}

  @UseGuards(JwtAuthGuard)
  @Post('send')
  async send(
    @User() user: JwtUserDto,
    @Body('amount') amount: number,
    @Body('currency') currency: CurrencyType
  ) {
    const withdrawal = await this.payoutService.sendToCreator(
      user.userId,
      amount,
      currency
    );
    return { ok: true, withdrawal };
  }
}
