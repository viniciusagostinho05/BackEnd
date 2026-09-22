import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class BonificoDto {
    // toglie gli spazi e mette in maiuscolo: "it60 x054..." diventa così -> "IT60X054..."
    @Transform(({ value }) => typeof value === 'string' ? value.replace(/\s+/g, '').toUpperCase() : value)
    @IsString()
    @IsNotEmpty()
    ibanDestinatario: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    importo: number;
}