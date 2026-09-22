import { IsIn, IsNotEmpty, IsString, } from 'class-validator';

export class CreaCategoriaMovimentoDto {
  @IsNotEmpty()
  @IsString()
  nomeCategoria: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['Entrata', 'Uscita'])
  tipologia: 'Entrata' | 'Uscita';
}