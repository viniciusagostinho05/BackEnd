import { Schema, model, Document, Types } from 'mongoose';
import { TipologiaMovimento } from './categoria-movimento.entity';

export interface CategoriaMovimentoDocument extends Document {
  categoriaMovimentoId: string;
  nomeCategoria: string;
  tipologia: TipologiaMovimento;
}

const categoriaMovimentoSchema = new Schema<CategoriaMovimentoDocument>(
  {
    categoriaMovimentoId: {
        type: String,
        default: () => new Types.ObjectId().toString()
    },
    nomeCategoria: { type: String, required: true },
    tipologia: { type: String, enum: ['Entrata', 'Uscita'], required: true },
  },
  { collection: 'categoriemovimenti' }
);

export const CategoriaMovimentoModel = model<CategoriaMovimentoDocument>(
  'CategoriaMovimento',
  categoriaMovimentoSchema
);