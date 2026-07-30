import { PartialType } from '@nestjs/mapped-types';
import { CreateBookQuoteDto } from './create-book-quote.dto';

export class UpdateBookQuoteDto extends PartialType(CreateBookQuoteDto) {}
