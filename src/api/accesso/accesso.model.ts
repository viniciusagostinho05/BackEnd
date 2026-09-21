import { model, Schema } from "mongoose";
import { Accesso } from "./accesso.entity";

const accessoSchema = new Schema<Accesso>({
    IP: {
        type: String,
        required: true
    },
    DataOra: {
        type: Date,
        required: true
    },
    AccessoValido: {
        type: Boolean,
        required: true
    }
});

accessoSchema.set("toJSON", {
    transform: (_, ret: any) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

accessoSchema.set("toObject", {
    transform: (_, ret: any) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

export const AccessoModel = model<Accesso>(
    "Accesso",
    accessoSchema,
    "accessos"
);