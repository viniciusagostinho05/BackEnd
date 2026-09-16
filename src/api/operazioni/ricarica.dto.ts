import { IsIn, IsString } from "class-validator";

export class RicaricaDto {
    @IsString()
    numeroTelefonico: string;

    @IsIn(['iliad', 'tim', 'vodafone', 'windtre', 'fstweb'])
    operatore: string;

    @IsIn([5, 10, 15, 20, 30])
    taglio: number;
}