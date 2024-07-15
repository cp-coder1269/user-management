import { PartialType } from '@nestjs/mapped-types';
import { CreateBlockUserDto } from './create-block-user.dto';

export class UpdateBlockUserDto extends PartialType(CreateBlockUserDto) {}
