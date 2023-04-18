import { Module } from '@nestjs/common';
import { PetService } from './pet.service';
import { PrismaService } from '../core/orm/prisma.service';
import { PetController } from './pet.controller';

@Module({
  imports: [],
  controllers: [PetController],
  providers: [PetService, PrismaService],
})
export class PetModule {}
