import { Module } from '@nestjs/common';

import { AuthMicroserviceController } from './auth-microservice.controller';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { LocalStrategy } from './strategies/local.strategy';
import { ProviderModule } from './provider/provider.model';

const strategies = [LocalStrategy];

@Module({
  imports: [ProviderModule],
  controllers: [AuthController, AuthMicroserviceController],
  providers: [AuthService, ...strategies],
})
export class AuthModule {}
