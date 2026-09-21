import { model, Schema } from "mongoose";
import { MovimentoContoCorrente } from "./movimento-conto-corrente.entity";

const movimentoSchema = new Schema<MovimentoContoCorrente>({
    MovimentoID: {
        type: Number,
        required: true,
        unique: true
    },
    ContoCorrenteID: {
        type: Number,
        required: true
    },
    Data: {
        type: Date,
        required: true
    },
    Importo: {
        type: Number,
        required: true
    },
    Saldo: {
        type: Number,
        required: true
    },
    CategoriaMovimentoID: {
        type: Number,
        required: true
    },
    DescrizioneEstesa: {
        type: String,
        required: true
    }
});

movimentoSchema.set("toJSON", {
    transform: (_, ret: any) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

movimentoSchema.set("toObject", {
    transform: (_, ret: any) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

export const MovimentoContoCorrenteModel = model<MovimentoContoCorrente>(
    "MovimentoContoCorrente",
    movimentoSchema,
    "movimentocontocorrentes"
);