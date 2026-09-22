import mongoose, { model, models, Schema } from "mongoose";
import { ContoCorrente } from "./conto-corrente.entity";

const contoCorrenteSchema = new Schema<ContoCorrente>({
  contoCorrenteID: { type: Schema.Types.ObjectId, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cognomeTitolare: { type: String, required: true },
  nomeTitolare: { type: String, required: true },
  dataApertura: { type: Date, required: true },
  IBAN: { type: String, required: true }
});

contoCorrenteSchema.set("toJSON", {
  transform: (_, ret: any) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

contoCorrenteSchema.set("toObject", {
  transform: (_, ret: any) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const ContoCorrenteModel =  models.ContoCorrente || model<ContoCorrente>("ContoCorrente", contoCorrenteSchema);