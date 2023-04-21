import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { PetService } from './pet.service';
import { CreatePetDto } from './dto/pet.dto';
import { Pet } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('pets')
@Controller('pets')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiBody({ type: CreatePetDto, required: true })
  async create(
    @Req() req: any,
    @Res() res: any,
    @Body() body: CreatePetDto,
  ): Promise<Pet> {
    try {
      const tokenInfo = req.user.tokenInfo;
      const pet = await this.petService.create(body, tokenInfo.id);
      return res.status(HttpStatus.CREATED).json(pet);
    } catch (e) {}
  }
}
