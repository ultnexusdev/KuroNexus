import { IsInt, IsPositive } from 'class-validator';

/** Karakter dizininden çıkarma isteği (AGENTS.md kural 6: DTO zorunlu). */
export class HideCharacterDto {
  @IsInt()
  @IsPositive()
  characterId!: number;
}
