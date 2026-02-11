import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class TelegramUserDto {
  @IsNumber()
  id: number;

  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsUrl()
  photo_url?: string;

  @IsOptional()
  @IsString()
  language_code?: string;

  @IsOptional()
  @IsString()
  auth_date?: string;

  @IsOptional()
  @IsString()
  hash?: string;
}
