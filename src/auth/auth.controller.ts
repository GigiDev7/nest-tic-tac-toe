import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async signUp(@Body() userData: UserDto) {
    await this.authService.signUp(userData);
    return { message: 'Successfully registered' };
  }

  @Post('login')
  async signIn(@Body() userData: UserDto) {
    const result = await this.authService.signIn(userData);
    return result;
  }
}
