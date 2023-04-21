import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { ApiConsumes, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, fileFilter } from '../core';
import { RegisterDto } from '../auth/dto/auth.dto';
import { AuthGuard } from '../auth/auth.guard';
import { isMongoId } from 'class-validator';
import { CreatePetDto } from '../pet/dto/pet.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({ type: [RegisterDto] })
  @Get()
  async getAll(@Res() res: any) {
    try {
      const users = await this.userService.getAll();

      return res.status(HttpStatus.CREATED).json(users);
    } catch (e) {
      throw new HttpException(
        {
          status: e.status,
          error: e.message,
        },
        e.status,
      );
    }
  }

  @Get(':userId')
  @ApiResponse({ type: RegisterDto })
  async getById(@Res() res: any, @Param('userId') id: string) {
    try {
      const user = await this.userService.getById(id);

      return res.status(HttpStatus.CREATED).json(user);
    } catch (e) {
      throw new HttpException(
        {
          status: e.status,
          error: e.message,
        },
        e.status,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':userId')
  async delete(@Res() res: any, @Param('userId') id: string) {
    try {
      const result = isMongoId(id);

      if (!result) {
        throw new HttpException('Id not valid', 400);
      }

      await this.userService.delete(id);

      return res
        .status(HttpStatus.NO_CONTENT)
        .sendStatus(HttpStatus.NO_CONTENT);
    } catch (e) {
      throw new HttpException(
        {
          status: e.status,
          error: e.message,
        },
        e.status,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':userId')
  async update(
    @Res() res: any,
    @Param('userId') id: string,
    @Body() body: UpdateUserDto,
  ) {
    try {
      await this.userService.update(id, body);

      return res.status(HttpStatus.OK).sendStatus(HttpStatus.OK);
    } catch (e) {
      throw new HttpException(
        {
          status: e.status,
          error: e.message,
        },
        e.status,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Post('/upload/avatar/:userId')
  @ApiConsumes('multipart/form-data')
  @ApiHeader({
    name: 'accessToken',
    description: 'Access token to endpoints is closed',
  })
  @ApiHeader({
    name: 'avatar',
    description: 'Token access to closed endpoints',
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({ destination: './public', filename: editFileName }),
      fileFilter: fileFilter,
    }),
  )
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Param('userId') id: string,
    @Res() res: any,
  ) {
    try {
      const result: boolean = isMongoId(id);

      if (!result) {
        throw new HttpException('Id not valid', 400);
      }
      const pathName = `public/${file.filename}`;

      await this.userService.uploadAvatar(id, pathName);

      return res.status(HttpStatus.OK).sendStatus(HttpStatus.OK);
    } catch (e) {
      throw new HttpException(
        {
          status: e.status,
          error: e.message,
        },
        e.status,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Patch('/animals/:userId')
  async createAnimal(
    @Res() res: any,
    @Param('userId') id: string,
    @Body() body: CreatePetDto,
  ) {
    try {
      const result: boolean = isMongoId(id);
      console.log('hello world');

      if (!result) {
        throw new HttpException('Id not valid', 400);
      }

      const pets = await this.userService.createAnimal(id, body);

      return res.status(HttpStatus.OK).json(pets);
    } catch (e) {
      throw new HttpException(
        {
          status: e.status,
          error: e.message,
        },
        e.status,
      );
    }
  }
}
