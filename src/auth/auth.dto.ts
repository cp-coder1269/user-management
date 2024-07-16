import { IsArray, IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";

export class SignInDto {
    @IsNotEmpty()
    @IsString()
    username:string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^(\d{1,2}\/\d{1,2}\/\d{4})|(\d{1,2}-\d{1,2}-\d{4})$/, {
        message: 'birthdate must be in the format dd/mm/yyyy, d/m/yyyy, dd-mm-yyyy, or d-m-yyyy',
      })
    birthdate:string;
}
