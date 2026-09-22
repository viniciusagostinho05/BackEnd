import mongoose from "mongoose";

export type ContoCorrente = {
  contoCorrenteID: mongoose.Types.ObjectId;
  email: string;
  password: string;
  cognomeTitolare: string;
  nomeTitolare: string;
  dataApertura: Date;
  IBAN: string;
}