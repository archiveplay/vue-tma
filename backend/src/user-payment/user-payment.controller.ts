import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtUserDto } from 'src/auth/dto/jwt-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { User } from 'src/common/decorators/user.decorator';
import { CurrencyType } from 'src/common/types/currency.enum';
import { CreateInvoiceDto } from 'src/payment/dto/create-invoice.dto';

import { UserPaymentService } from './user-payment.service';

@Controller('user-payment')
export class UserPaymentController {
  private readonly logger = new Logger(UserPaymentController.name);
  constructor(private readonly userPaymentService: UserPaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('top-up')
  async topUpBalance(@Body() dto: CreateInvoiceDto, @User() user: JwtUserDto) {
    const invoicePayload = `[user-payment/top-up]: ${user.userId} ${new Date()}`;

    const id = await this.userPaymentService.createUserPayment(
      user.userId,
      dto.provider,
      dto.amount,
      dto.currency || CurrencyType.USDT,
      invoicePayload
    );

    const invoice = await this.userPaymentService.createInvoice(
      user,
      invoicePayload,
      dto
    );

    invoice.id = id;

    this.logger.log(
      `Invoice [${id}] ${dto.title} successfully created for user ${user.userId}`
    );
    return invoice;
  }

  @Get(':id/status')
  async getPaymentStatus(@Param('id') id: string) {
    const payment = await this.userPaymentService.getPaymentById(Number(id));

    if (!payment) {
      throw new NotFoundException(`Payment with id=${id} not found`);
    }

    this.logger.log(`Payment ${id} status checked: ${payment.status}`);

    return {
      id: payment.id,
      status: payment.status,
    };
  }
}
