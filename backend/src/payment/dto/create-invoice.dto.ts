import { PaymentProviderType } from '@prisma/client';
import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { CurrencyType } from 'src/common/types/currency.enum';

export class CreateInvoiceDto {
  @IsEnum(PaymentProviderType)
  provider: PaymentProviderType;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  payload: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsEnum(CurrencyType)
  currency?: CurrencyType;
}
