import { Module } from '@nestjs/common';
import { AuthModule } from '@app/auth';
import { UsersModule } from '@app/users';
import { ApiAuthController } from './api-auth.controller';
import { ApiAuthService } from './api-auth.service';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [ApiAuthController],
  providers: [ApiAuthService],
})
export class ApiAuthModule {}
