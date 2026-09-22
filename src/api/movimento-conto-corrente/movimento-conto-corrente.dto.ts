import { IsNotEmpty, IsNumber, IsPositive, IsString, IsOptional, IsInt, Min, } from 'class-validator';

export class DepositoDto {
  @IsNotEmpty()
  @IsString()
  contoCorrenteId!: string;

  @IsNumber()
  @IsPositive()
  importo!: number;

  @IsNotEmpty()
  @IsString()
  categoriaId!: string;

  @IsOptional()
  @IsString()
  descrizione?: string;
}
   

export class RitiroDto {
  @IsNotEmpty()
  @IsString()
  contoCorrenteId!: string;

  @IsNumber()
  @IsPositive()
  importo!: number;

  @IsNotEmpty()
  @IsString()
  categoriaId!: string;

  @IsOptional()
  @IsString()
  descrizione?: string;
}