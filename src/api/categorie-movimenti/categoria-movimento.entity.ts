export type TipologiaMovimento = 'Entrata' | 'Uscita';

export interface CategoriaMovimento {
  _id: string;
  nomeCategoria: string;
  tipologia: TipologiaMovimento;
}