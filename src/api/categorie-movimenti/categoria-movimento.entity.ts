export type TipologiaMovimento = 'Entrata' | 'Uscita';

export interface CategoriaMovimento {
  categoriaMovimentoId: string;
  nomeCategoria: string;
  tipologia: TipologiaMovimento;
}