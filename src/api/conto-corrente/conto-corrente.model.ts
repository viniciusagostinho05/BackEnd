import { model, Schema } from "mongoose";
import { ContoCorrente } from "./conto-corrente.entity";

const contoCorrenteSchema = new Schema<ContoCorrente>({
  ContoCorrenteID: { type: Number, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  CognomeTitolare: { type: String, required: true },
  NomeTitolare: { type: String, required: true },
  DataApertura: { type: Date, required: true },
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

export const ContoCorrenteModel = model<ContoCorrente>(
  "ContoCorrente",
  contoCorrenteSchema,
  "contocorrentes"
);