import { Module } from '@nestjs/common';
import { PrismaService } from '../core';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [PrismaService, UserService, JwtService],
})
export class UserModule {}
