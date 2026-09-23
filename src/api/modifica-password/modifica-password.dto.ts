import {
    IsNotEmpty,
    IsString,
    Matches
} from "class-validator";

export class ModificaPasswordDto {

    @IsString()
    @IsNotEmpty()
    passwordAttuale!: string;

    @IsString()
    @IsNotEmpty()
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        {
            message:
                "La nuova password deve contenere almeno 8 caratteri, una maiuscola, una minuscola e un numero."
        }
    )
    nuovaPassword!: string;

    @IsString()
    @IsNotEmpty()
    confermaPassword!: string;

}