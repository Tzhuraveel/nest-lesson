import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { UpdateUserDto } from './dto/user.dto';
import { IUser } from './interface/IUser';
import { EGetDynamically } from './enum/getDynamicallyUser';

import { PrismaService } from '../core';
import * as fs from 'fs';
import { CreatePetDto } from '../pet/dto/pet.dto';

@Injectable()
export class UserService {
  public async getDynamicallyUser(
    typeOfDynamic: EGetDynamically,
    data: string,
    dbField: 'id' | 'email',
  ): Promise<User | void> {
    try {
      const foundUser = await this.prismaService.user.findUnique({
        where: { [dbField]: data },
      });

      switch (typeOfDynamic) {
        case EGetDynamically.NEXT:
          if (!foundUser) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
          }
          return foundUser;
        case EGetDynamically.THROW:
          if (foundUser) {
            throw new HttpException(
              'User already exist',
              HttpStatus.BAD_REQUEST,
            );
          }
          break;
      }
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }

  constructor(private readonly prismaService: PrismaService) {}

  public async getAll(): Promise<User[]> {
    try {
      return await this.prismaService.user.findMany();
    } catch (e) {}
  }

  public async getById(id: string): Promise<IUser> {
    try {
      const foundUser = await this.prismaService.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          city: true,
          age: true,
        },
      });

      if (!foundUser) {
        throw new HttpException('User not found', 400);
      }

      return foundUser;
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      await this.getDynamicallyUser(EGetDynamically.NEXT, id, 'id');

      await this.prismaService.user.delete({ where: { id } });
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }

  public async update(id: string, user: UpdateUserDto): Promise<void> {
    try {
      await this.getDynamicallyUser(EGetDynamically.NEXT, id, 'id');

      await this.prismaService.user.update({
        where: { id },
        data: { ...user },
        select: {
          id: true,
          name: true,
          email: true,
          city: true,
          age: true,
        },
      });
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }

  public async uploadAvatar(userId: string, path: string): Promise<User> {
    try {
      const foundUser = await this.prismaService.user.findUnique({
        where: { id: userId },
      });

      if (!foundUser) {
        await fs.unlink(path, (err) => {
          if (err) {
            throw new HttpException(err.message, 400);
          }
        });
        throw new HttpException('User not found', 400);
      } else if (foundUser.avatar) {
        await fs.unlink(foundUser.avatar, (err) => {
          if (err) {
            throw new HttpException(err.message, 400);
          }
        });
      }

      return await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          avatar: path,
        },
      });
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }

  public async createAnimal(id: string, body: CreatePetDto): Promise<any> {
    try {
      await this.getDynamicallyUser(EGetDynamically.NEXT, id, 'id');

      await this.prismaService.user.update({
        where: { id },
        data: {
          pets: {
            create: {
              name: body.name,
              age: body.age,
              breed: body.breed,
            },
          },
        },
      });

      return await this.prismaService.user.findUnique({
        where: {
          id: id,
        },
        include: {
          pets: {
            select: {
              id: true,
              name: true,
              age: true,
              breed: true,
            },
          },
        },
      });
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }
}
