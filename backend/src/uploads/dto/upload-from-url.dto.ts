import { IsString, IsUrl, MaxLength } from 'class-validator';

/**
 * Adresten görsel alma isteği.
 *
 * `IsUrl` yalnızca biçim denetimi — asıl güvenlik `RemoteImageService`te
 * (şema kontrolü, iç ağ adreslerinin reddi, yönlendirme süzgeci). DTO burada
 * doğrulanmamış alanların düşmesi için var (AGENTS.md kural 6).
 */
export class UploadFromUrlDto {
  @IsString()
  @MaxLength(2048)
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  url!: string;
}
