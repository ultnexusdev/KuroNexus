import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString({ message: 'VALIDATION.INVALID_PASSWORD' })
  @MinLength(8, { message: 'VALIDATION.PASSWORD_TOO_SHORT' })
  currentPassword: string;

  @IsString({ message: 'VALIDATION.INVALID_PASSWORD' })
  @MinLength(8, { message: 'VALIDATION.PASSWORD_TOO_SHORT' })
  @MaxLength(72, { message: 'VALIDATION.PASSWORD_TOO_LONG' })
  newPassword: string;
}
