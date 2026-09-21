import { Schema, model, Types, Document, models, Model } from 'mongoose';

export interface MovimentoDocument extends Document {
  contoCorrenteId: Types.ObjectId;
  data: Date;
  importo: number;
  saldo: number;
  categoriaMovimentoId: Types.ObjectId;
  descrizioneEstesa: string;
}

const movimentoSchema = new Schema<MovimentoDocument>(
  {
    contoCorrenteId: {
      type: Schema.Types.ObjectId,
      ref: 'ContoCorrente',
      required: true,
      index: true,
    },
    data: { type: Date, required: true, index: true },
    importo: { type: Number, required: true },
    saldo: { type: Number, required: true },
    categoriaMovimentoId: {
      type: Schema.Types.ObjectId,
      ref: 'CategoriaMovimento',
      required: true,
    },
    descrizioneEstesa: { type: String, required: true },
  },
  { collection: 'movimenti' }
);

// Idempotente: se un altro modulo (Registrazione, Bonifico, Ricarica) registra
// "Movimento" prima di questo file, riusiamo quel model invece di ridefinirlo.
// Evita OverwriteModelError indipendentemente dall'ordine di import.
export const MovimentoModel =
  (models.Movimento as Model<MovimentoDocument>) ??
  model<MovimentoDocument>('Movimento', movimentoSchema);