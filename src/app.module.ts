import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { PetController } from './pet/pet.controller';
import { UserModule } from './user/user.module';
import { PetModule } from './pet/pet.module';

@Module({
  imports: [UserModule, PetModule],
  controllers: [AppController, UserController, PetController],
  providers: [AppService],
})
export class AppModule {}
