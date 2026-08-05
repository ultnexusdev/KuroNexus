import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { AuthService, LoginResult } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  AUTH_COOKIE_NAME,
  authCookieOptions,
  clearAuthCookieOptions,
} from '../common/auth-cookie';
import type { AuthenticatedUser } from '../common/types/authenticated-user';

// NOT: /register endpoint'i bilinçli olarak YOK — kayıt Faz 2'ye kadar kapalı
// (AGENTS.md kural 12). Tek kullanıcı admin seed script'iyle oluşturulur.
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Giriş token'ı HttpOnly çereze yazar.
   *
   * ⚠️ FAZ A: token yanıt gövdesinde de dönmeye DEVAM ediyor. Frontend hâlâ
   * eski yolu kullandığı için bu kaldırılırsa giriş kırılır. Gövdeden çıkarma
   * işi, frontend çereze geçtiğinde (Faz B) yapılacak — asıl kazanç orada.
   */
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResult> {
    const result = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );
    response.cookie(AUTH_COOKIE_NAME, result.accessToken, authCookieOptions());
    return result;
  }

  /**
   * Çerezi tarayıcı değil sunucu yazdığı için silmesi de sunucunun işi.
   * `@Public()`: süresi dolmuş token'la da çıkış yapılabilmeli, yoksa kullanıcı
   * 401 yüzünden çerezi silemeden kilitli kalır.
   */
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response): void {
    response.clearCookie(AUTH_COOKIE_NAME, clearAuthCookieOptions());
  }

  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }

  // Varsayılan guard zinciri korur: yalnızca geçerli JWT ile erişilir,
  // mevcut şifre de ayrıca doğrulanır (kural 6).
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('password')
  async changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ChangePasswordDto,
  ): Promise<void> {
    await this.authService.changePassword(
      user.id,
      dto.currentPassword,
      dto.newPassword,
    );
  }
}
