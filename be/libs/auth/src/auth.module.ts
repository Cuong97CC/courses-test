import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersModule } from '@app/users';
import { ConfigModule } from '@nestjs/config';
import { AuthConfig } from './auth.config';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [
    ConfigModule.forFeature(AuthConfig),
    UsersModule,
    JwtModule.register({
      signOptions: {
        algorithm: 'RS256',
      },
    }),
  ],
  providers: [AuthService, AuthMiddleware],
  exports: [AuthService],
})
export class AuthModule {}
