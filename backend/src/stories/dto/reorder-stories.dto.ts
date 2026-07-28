import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsString } from 'class-validator';

// El yazması ağacındaki bölüm sırası: dizideki konum orderIndex olur.
export class ReorderStoriesDto {
  @IsArray({ message: 'VALIDATION.INVALID_ORDER_LIST' })
  @ArrayNotEmpty({ message: 'VALIDATION.INVALID_ORDER_LIST' })
  @ArrayMaxSize(500, { message: 'VALIDATION.INVALID_ORDER_LIST' })
  @IsString({ each: true, message: 'VALIDATION.INVALID_ORDER_LIST' })
  ids: string[];
}
