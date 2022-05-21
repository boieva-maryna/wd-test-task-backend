import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserJWTPayload } from 'src/auth/types';

export const JWTPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserJWTPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
