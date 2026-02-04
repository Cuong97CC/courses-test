import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IRequestWithAuth } from '../auth.type';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<IRequestWithAuth>();
    return request.user;
  },
);
