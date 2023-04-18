import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Matches(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)
  @IsString()
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$/)
  @IsString()
  password: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @ApiProperty({ required: true })
  @IsBoolean()
  @IsOptional()
  status: boolean;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  city: string;
}

export class LoginDto extends PickType(RegisterDto, [
  'password',
  'email',
] as const) {}
