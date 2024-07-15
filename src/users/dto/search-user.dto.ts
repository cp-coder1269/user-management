import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class SearchUserDto {
    @IsOptional()
    @IsString()
    username?: string;
  
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    minAge?: number;
  
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Max(100)
    maxAge?: number;

    @IsOptional()
    @IsString()
    @IsIn(['id', 'age', 'username'])
    sortBy?: string;

    @IsOptional()
    @IsString()
    @IsIn(['ASC', 'DESC'])
    sortOrder?: 'ASC' | 'DESC';
}