import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';
import * as argon from 'argon2';

@Injectable({}) //This is "Dependency Injection"
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async register(authDTO: AuthDTO) {
    const hashPassword = await argon.hash(authDTO.password);
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: authDTO.email,
          password: hashPassword,
          name: authDTO.name,
        },
      });

      return user;
    } catch (error) {
      console.log(error);
      throw new ForbiddenException(error);
    }
  }

  async getAllUser() {
    const result = await this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return result;
  }
}
