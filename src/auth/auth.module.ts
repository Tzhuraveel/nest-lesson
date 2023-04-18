import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../core';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { configs } from '../core/config';
@Module({
  imports: [JwtModule.register({ secret: configs.TOKENS.TOKEN_SECRET_KEY })],
  controllers: [AuthController],
  providers: [PrismaService, AuthService, UserService],
})
export class AuthModule {}
