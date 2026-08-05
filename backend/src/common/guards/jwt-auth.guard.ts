import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { readAuthCookie } from '../auth-cookie';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  AuthenticatedUser,
  JwtPayload,
} from '../types/authenticated-user';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthenticatedUser }>();
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('AUTH.TOKEN_MISSING');
    }

    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('AUTH.TOKEN_INVALID');
    }

    // Rol her istekte veritabanından doğrulanır (AGENTS.md kural 6) —
    // token payload'ındaki role güvenilmez.
    const user = await this.prisma.user.findFirst({
      where: { id: payload.sub, isDeleted: false },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!user) {
      throw new UnauthorizedException('AUTH.USER_NOT_FOUND');
    }

    request.user = user;
    return true;
  }

  /**
   * Asıl kaynak HttpOnly çerez. `Authorization: Bearer` yedeği kalıcı olarak
   * duruyor: Next sunucusu sayfa render'ında çerezi kendisi okuyup `/auth/me`ye
   * bu başlıkla soruyor, orada çerez otomatik iletilmiyor. Tarayıcıdaki
   * JavaScript token'ı artık hiçbir yerden okuyamadığı için bu yedek saldırgana
   * kapı açmıyor — başlığa koyacak token'ı bulamıyor.
   */
  private extractToken(request: Request): string | undefined {
    const fromCookie = readAuthCookie(request.headers.cookie);
    if (fromCookie) {
      return fromCookie;
    }
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
