import { PartialType } from '@nestjs/mapped-types';
import { CreateTransferNewsDto } from './create-transfer-news.dto';

export class UpdateTransferNewsDto extends PartialType(CreateTransferNewsDto) {}
