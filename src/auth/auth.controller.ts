import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('SignIn')
  SignIn(@Body() dto:AuthDto) {
    return this.authService.Login(dto)
  }

  @Post('signup')
  signUp(@Body() dto:AuthDto) {
    return this.authService.SignUp(dto)
  }
}
