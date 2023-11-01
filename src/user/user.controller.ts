import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { MyJwt } from 'src/auth/guard';

@Controller('user')
export class UserController {
  // @UseGuards(AuthGuard('jwt'))
  @UseGuards(MyJwt) //you can also make your own
  @Get('me')
  me(@Req() request: Request) {
    return request.user;
  }
}
