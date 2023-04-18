import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: RegisterDto, required: true })
  async register(@Body() body: RegisterDto, @Res() res: any) {
    try {
      await this.authService.register(body);

      return res.status(HttpStatus.CREATED).sendStatus(HttpStatus.CREATED);
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

  @Post('login')
  @ApiBody({ type: LoginDto, required: true })
  async login(@Body() body: LoginDto, @Res() res: any) {
    try {
      const tokenPair = await this.authService.login(body);

      return res.status(HttpStatus.CREATED).json(tokenPair);
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
