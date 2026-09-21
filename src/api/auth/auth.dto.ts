import { IsEmail, IsIBAN, IsMongoId, IsNumber, IsOptional, IsString, IsUrl, Matches } from "class-validator";

export class ContoCorrenteDto {

  @IsOptional()
  @IsMongoId() contoCorrenteId: string;

  @IsEmail() email: string;

  @Matches( new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$'),
    {
      message: 'password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.'
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