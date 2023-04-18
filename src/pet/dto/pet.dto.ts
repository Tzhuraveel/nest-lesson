import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePetDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  breed: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  age: number;
}
