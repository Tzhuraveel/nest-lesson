import * as bcrypt from 'bcrypt';
import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { LoginDto, RegisterDto } from './dto/auth.dto';
import { EGetDynamically } from '../user/enum/getDynamicallyUser';
import { PrismaService } from '../core';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ITokenPair, ITokenPayload } from './interface/token.interface';

@Injectable()
export class AuthService {
  private generateAccessRefreshToken(
    payload: ITokenPayload,
    accessTime: string,
    refreshTime: string,
  ): ITokenPair {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: accessTime,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: refreshTime,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private async hashedPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  private async comparePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  public async register(user: RegisterDto): Promise<void> {
    try {
      await this.userService.getDynamicallyUser(
        EGetDynamically.THROW,
        user.email,
        'email',
      );

      const hashedPassword = await this.hashedPassword(user.password);

      await this.prismaService.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          age: user.age,
          city: user.city,
        },
      });
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }

  public async login(credentials: LoginDto): Promise<ITokenPair> {
    try {
      const user = (await this.userService.getDynamicallyUser(
        EGetDynamically.NEXT,
        credentials.email,
        'email',
      )) as User;

      const isMatched = await this.comparePassword(
        credentials.password,
        user.password,
      );

      if (!isMatched) {
        throw new UnauthorizedException();
      }

      const tokenPair = this.generateAccessRefreshToken(
        { username: user.name, id: user.id },
        '15m',
        '30d',
      );

      await this.prismaService.token.create({
        data: { userId: user.id, ...tokenPair },
      });

      return tokenPair;
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }
}
