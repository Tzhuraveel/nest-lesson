import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/orm/prisma.service';
import { CreatePetDto } from './dto/pet.dto';
import { Pet } from '@prisma/client';

@Injectable()
export class PetService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(pet: CreatePetDto, userId: number): Promise<Pet> {
    try {
      return await this.prismaService.pet.create({
        data: {
          name: pet.name,
          age: pet.age,
          breed: pet.breed,
          ownerId: userId,
        },
      });
    } catch (e) {}
  }
}
