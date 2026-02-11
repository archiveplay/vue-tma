import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtUserDto } from 'src/auth/dto/jwt-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { User } from 'src/common/decorators/user.decorator';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Post('set-wallet')
  async setWallet(@User() user: JwtUserDto, @Body('address') address: string) {
    if (!address) throw new Error('Address is required');

    const updatedUser = await this.userService.setWallet(user.userId, address);
    return {
      ok: true,
      wallet: updatedUser.tonWallet,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@User() user: JwtUserDto) {
    const dbUser = await this.userService.getProfile(user.userId);

    return {
      message: 'Protected user profile',
      user: dbUser,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('balance')
  async getBalance(@User() user: JwtUserDto) {
    const balances = await this.userService.getUserBalances(user.userId);

    return { balances };
  }
}
