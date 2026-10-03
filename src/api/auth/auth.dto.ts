import { IsEmail, IsIBAN, IsMongoId, IsNumber, IsOptional, IsString, IsUrl, Matches } from "class-validator";

export class ContoCorrenteDto {


  @IsEmail() email: string;

  @Matches( new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$'),
    {
      message: 'La password deve contenere almeno: una lettera maiuscola, una lettera minuscola, un numero, un carattere speciale.'
    }
  )  password: string;

  @IsString() nomeTitolare: string;

  @IsString() cognomeTitolare: string;

  @IsOptional()
  @IsIBAN() IBAN: string;

  @IsOptional()
  @IsString() dataApertura: string;

}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}