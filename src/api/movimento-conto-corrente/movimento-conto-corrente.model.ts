import { model, Schema, Types } from "mongoose";
import { MovimentoContoCorrente } from "./movimento-conto-corrente.entity";

const movimentoSchema = new Schema<MovimentoContoCorrente>({
    MovimentoID: {
        type: String,
        default: () => new Types.ObjectId().toString()
    },
    ContoCorrenteID: {
        type: String
    },
    Data: {
        type: String,
        default: () => new Date().toISOString()
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
        type: String
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

export const MovimentoContoCorrenteModel = model<MovimentoContoCorrente>( "MovimentoContoCorrente", movimentoSchema );