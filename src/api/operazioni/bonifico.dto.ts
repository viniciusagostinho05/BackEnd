import { IsNumber, IsPositive, IsString } from "class-validator";

export class BonificoDto{
    @IsString()
    ibanDestinatario: string;

    @IsNumber()
    @IsPositive()
    importo: number;
}

