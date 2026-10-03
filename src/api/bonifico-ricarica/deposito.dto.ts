import { IsNumber, IsOptional, IsPositive, IsString, Max, MaxLength } from "class-validator";

export class DepositoDto {
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    @Max(10000) // limite per singolo deposito, a vostra scelta
    importo: number;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    descrizione?: string;
}