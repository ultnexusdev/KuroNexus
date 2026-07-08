import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'VALIDATION.INVALID_EMAIL' })
  email: string;

  @IsString({ message: 'VALIDATION.INVALID_PASSWORD' })
  @MinLength(8, { message: 'VALIDATION.PASSWORD_TOO_SHORT' })
  password: string;
}
