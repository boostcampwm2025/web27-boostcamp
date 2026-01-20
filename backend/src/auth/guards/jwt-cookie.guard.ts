import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { jwtVerify } from 'jose';
import { type Request } from 'express';
import { UserRole } from 'src/user/entities/user.entity';

const getJwtSecret = () => {
  const value = process.env.JWT_SECRET;
  if (!value) {
    throw new Error('JWT_SECRET is missing');
  }
  return new TextEncoder().encode(value);
};
type AuthenticatedRequest = Request & {
  user?: { userId: number; role: UserRole; email?: string };
};

@Injectable()
export class JwtCookieGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = req.cookies?.access_token as string;

    if (!token) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }

    try {
      const { payload } = await jwtVerify(token, getJwtSecret());
      req.user = {
        userId: Number(payload.sub),
        role: payload.role as UserRole,
        email: payload.email as string | undefined,
      };
      return true;
    } catch {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }
}
