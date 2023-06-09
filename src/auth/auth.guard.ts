import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { configs } from '../core/config';
import { PrismaService } from '../core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization;

      if (!token) {
        throw new HttpException('No token', 400);
      }

      const payload = this.jwtService.verify(token, {
        secret: configs.TOKENS.TOKEN_SECRET_KEY,
      });

      const tokenInfo = this.prismaService.token.findFirst({
        where: { accessToken: token },
      });

      if (!tokenInfo) {
        throw new HttpException('Token not found', 400);
      }

      request['user'] = { payload, tokenInfo };
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
    return true;
  }
}
