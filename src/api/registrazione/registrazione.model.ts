import { model, Schema, Types } from "mongoose";
import { ContoCorrente } from "./registrazione.entity";
import { IBAN } from "@dellacagna/iban";

const userSchema = new Schema<ContoCorrente>({
  contoCorrenteId: {
    type: String,
    default: () => new Types.ObjectId().toString()
  },
  nomeTitolare: String,
  cognomeTitolare: String,
  IBAN: {
    type: String,
    default: () => IBAN.random('IT')
  },
  dataApertura: {
    type: String,
    default: () => new Date().toISOString()
  },
  email: String,
  password: String,
  isVerified: {
    type: Boolean,
    default: false,
  }
});

userSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret: any) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

userSchema.set('toObject', {
  virtuals: true,
  transform: (_, ret: any) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const contoCorrenteModel = model<ContoCorrente>('ContoCorrente', userSchema);
