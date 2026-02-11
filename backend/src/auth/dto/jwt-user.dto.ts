import { IsNumber, IsString } from 'class-validator';

export class JwtUserDto {
  @IsNumber()
  userId: number;

  @IsString()
  username: string;
}
