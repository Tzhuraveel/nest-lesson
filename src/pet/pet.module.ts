import { Module } from '@nestjs/common';
import { PetService } from './pet.service';
import { PrismaService } from '../core';
import { PetController } from './pet.controller';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [AuthModule],
  controllers: [PetController],
  providers: [PetService, PrismaService, JwtService],
})
export class PetModule {}
