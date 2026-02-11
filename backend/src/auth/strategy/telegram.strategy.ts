import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  validate,
  isSignatureInvalidError,
  SignatureInvalidError,
  parse,
} from '@telegram-apps/init-data-node';
import { Strategy } from 'passport-custom';

@Injectable()
export class TelegramStrategy extends PassportStrategy(
  Strategy,
  'telegram-web-app'
) {
  constructor(private readonly config: ConfigService) {
    super();
  }

  async validate(req: any) {
    const initData = req.body.initData as string;
    if (!initData) {
      throw new UnauthorizedException('initData missing');
    }

    const botToken = this.config.get<string>('BOT_TOKEN');
    if (!botToken) throw new UnauthorizedException('BOT_TOKEN not set');

    try {
      validate(initData, botToken);
    } catch (e) {
      if (isSignatureInvalidError(e)) {
        throw new SignatureInvalidError();
      }
      throw new UnauthorizedException('Invalid initData');
    }

    const { user } = parse(initData);

    return user;
  }
}
