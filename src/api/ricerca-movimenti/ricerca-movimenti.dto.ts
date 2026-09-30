import { IsInt, IsMongoId, IsOptional, IsPositive, IsString } from 'class-validator';

export class RicercaMovimentiQueryDto {
  @IsInt()
  @IsPositive()
  n: number;

  @IsMongoId()
  contoCorrenteId: string;

  @IsOptional()
  @IsMongoId()
  categoriaId?: string;

  @IsOptional()
  @IsString()
  dataDa?: string;

  @IsOptional()
  @IsString()
  dataA?: string;
}