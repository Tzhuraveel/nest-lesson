import { Body, Controller, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PetService } from './pet.service';
import { CreatePetDto } from './dto/pet.dto';
import { User } from '@prisma/client';

@ApiTags('pets')
@Controller('pets')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Post(':userId')
  async create(
    @Res() res: any,
    @Body() body: CreatePetDto,
    @Param('userId') id: number,
  ): Promise<User> {
    try {
      return res
        .status(HttpStatus.CREATED)
        .json(await this.petService.create(body, id));
    } catch (e) {}
  }
}
