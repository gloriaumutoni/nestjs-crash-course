import { AuthService } from './auth.service';
import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('SignIn')
  SignIn() {
    return 'Am SignIned in';
  }

  @Post('signup')
  signUp() {
    return 'signedUp';
  }
}
