import { IsDateString, IsEmail, IsNotEmpty, IsString, Matches, isString } from "class-validator";


// create-user-dto
export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name:string;

    @IsString()
    surname:string;

    @IsNotEmpty()
    @IsString()
    username:string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^(\d{1,2}\/\d{1,2}\/\d{4})|(\d{1,2}-\d{1,2}-\d{4})$/, {
        message: 'birthdate must be in the format dd/mm/yyyy, d/m/yyyy, dd-mm-yyyy, or d-m-yyyy',
      })
    // @Matches(/^(0?[1-9]|[12][0-9]|3[01])[\/-](0?[1-9]|1[012])[\/-]\d{4}$/, {
    //     message: 'day should be in range [1,31] and month should be in range [1,12]',
    //   })
    birthdate:string;

}