import { IsEmail, IsString, Matches } from "class-validator";

export class RegisterDto {

  @IsEmail()
  Email: string;

  @Matches(
    new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$'),
    {
      message: 'La password deve contenere almeno 8 caratteri, una maiuscola, una minuscola, un numero e un simbolo.'
    }
  )
  Password: string;

  @IsString()
  ConfermaPassword: string;

  @IsString()
  NomeTitolare: string;

  @IsString()
  CognomeTitolare: string;
}

export class LoginDto {

  @IsEmail()
  email: string;

  @IsString()
  password: string;

}