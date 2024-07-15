import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

export class CreateBlockUserDto {
    @IsNotEmpty()
    @IsNumber()
    userId:number;

    @IsNotEmpty()
    @IsArray()
    blockIds:[number]
}
