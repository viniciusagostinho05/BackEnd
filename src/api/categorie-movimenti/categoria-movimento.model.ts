import { Schema, model, Document } from 'mongoose';
import { TipologiaMovimento } from './categoria-movimento.entity';

export interface CategoriaMovimentoDocument extends Document {
  nomeCategoria: string;
  tipologia: TipologiaMovimento;
}

const categoriaMovimentoSchema = new Schema<CategoriaMovimentoDocument>(
  {
    nomeCategoria: { type: String, required: true },
    tipologia: { type: String, enum: ['Entrata', 'Uscita'], required: true },
  },
  { collection: 'categoriemovimenti' }
);

// ATTENZIONE: se chi ha già implementato il caricamento delle categorie
// (spec: "Caricare delle CategorieMovimenti...") ha già un model per questa
// collection, IMPORTATE quello invece di ridefinirlo qui — stesso discorso
// fatto per il model Movimento, per evitare OverwriteModelError.
export const CategoriaMovimentoModel = model<CategoriaMovimentoDocument>(
  'CategoriaMovimento',
  categoriaMovimentoSchema
);