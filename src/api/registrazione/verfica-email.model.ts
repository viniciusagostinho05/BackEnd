import mongoose, { Document, Schema } from 'mongoose';

export interface IVerificaEmail extends Document {
  contoCorrenteId: mongoose.Types.ObjectId;
  token: string;
  createdAt: Date;
}

const verificaEmailSchema = new Schema<IVerificaEmail>({
  contoCorrenteId: {
    type: Schema.Types.ObjectId,
    ref: 'ContoCorrente',
    required: true,
  },

  token: {
    type: String,
    required: true,
    unique: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400,
  },
});

export const VerificaEmailModel = mongoose.model<IVerificaEmail>('VerificaEmail', verificaEmailSchema);