import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../core';
import { CreatePetDto } from './dto/pet.dto';
import { Pet } from '@prisma/client';

@Injectable()
export class PetService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(pet: CreatePetDto, userId: string): Promise<Pet> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new HttpException('User not found', 400);
      }
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
