import { Controller, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { TelegramUserDto } from './dto/telegram-user.dto';
import { TelegramAuthGuard } from './guard/telegram.guard';
import { User } from '../common/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(TelegramAuthGuard)
  @Post('login')
  async login(@User() user: TelegramUserDto) {
    return this.authService.generateJwt(user);
  }
}
