import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { SqlModule } from '@app/sql';
import { AuthModule } from '@app/auth';
import { AuthMiddleware } from '@app/auth/middlewares/auth.middleware';
import { ApiAuthModule } from './modules/api-auth/api-auth.module';
import { ApiCoursesModule } from './modules/api-courses/api-courses.module';
import { ApiEnrollmentsModule } from './modules/api-enrollments/api-enrollments.module';
import { UsersModule } from '@app/users';

@Module({
  imports: [
    SqlModule,
    AuthModule,
    UsersModule,
    ApiAuthModule,
    ApiCoursesModule,
    ApiEnrollmentsModule,
  ],
})
export class AppModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.ALL },
        { path: 'auth/sign-up', method: RequestMethod.ALL },
        { path: 'auth/refresh-token', method: RequestMethod.ALL },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
