import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({}) //This is "Dependency Injection"
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  doSomething() {
    return 'Hello world';
  }
}
