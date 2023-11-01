import { AuthGuard } from '@nestjs/passport';

export class MyJwt extends AuthGuard('jwt') {}
