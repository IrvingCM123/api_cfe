import { PartialType } from '@nestjs/mapped-types';
import { CreateSelloDto } from './create-sello.dto';

export class UpdateSelloDto extends PartialType(CreateSelloDto) {}
