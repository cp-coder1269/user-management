import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

export class CreateBlockUserDto {
    @IsNotEmpty()
    @IsArray()
    blockIds:[number]
}
