import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { AuthDTO } from './dto';
import * as argon from 'argon2';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: AuthDTO) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: AuthDTO) {
    return this.authService.login(body);
  }

  @Get()
  async getAll() {
    return this.authService.getAllUser();
  }
}
