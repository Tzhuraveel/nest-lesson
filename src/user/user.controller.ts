import { join } from 'path';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, fileFilter } from '../core';
import { RegisterDto } from '../auth/dto/auth.dto';
import { AuthGuard } from '../auth/auth.guard';

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
  async getById(@Res() res: any, @Param('userId', ParseIntPipe) id: number) {
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
  async delete(@Res() res: any, @Param('userId', ParseIntPipe) id: number) {
    try {
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

  @Patch(':userId')
  async update(
    @Res() res: any,
    @Param('userId', ParseIntPipe) id: number,
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

  @Post('/upload/avatar/:userId')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({ destination: './public', filename: editFileName }),
      fileFilter: fileFilter,
    }),
  )
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: any,
  ) {
    try {
      const pathName = join('public', file.filename);

      await this.userService.uploadAvatar(userId, pathName);

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
}
