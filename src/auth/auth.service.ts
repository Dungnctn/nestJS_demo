import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({}) //This is "Dependency Injection"
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

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
      throw new ForbiddenException('error');
    }
  }

  async login(authDTO: AuthDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: authDTO.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('User not found!');
    }
    const passwordMatched = await argon.verify(user.password, authDTO.password);
    if (!passwordMatched) {
      throw new ForbiddenException('Email or Password incorrect');
    }
    delete user.password;
    return await this.signJwt(user.id, user.email, user.name);
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

  async signJwt(
    userId: number,
    email: string,
    name: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      id: userId,
      email,
      name,
    };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: this.configService.get('JWT_SECRET'),
    });

    return {
      accessToken: token,
    };
  }
}
