import { IsIn, IsMongoId, Matches } from "class-validator";

export class RicaricaDto {

    @IsMongoId()
    contoCorrenteId: string;

    @Matches(/^\+?\d{8,15}$/, { message: 'numeroTelefonico non valido' })
    numeroTelefonico: string;

    @IsIn(['iliad', 'tim', 'vodafone', 'windtre', 'fastweb'])
    operatore: string;

    @IsIn([5, 10, 15, 20, 30])
    taglio: number;
}