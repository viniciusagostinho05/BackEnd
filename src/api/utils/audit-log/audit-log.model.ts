import { model, Schema } from "mongoose";
import { AuditLog } from "./audit-log.entity";

const auditLogSchema = new Schema <AuditLog> ({
    contoCorrenteId: { type: Schema.Types.ObjectId, ref: 'ContoCorrente' },
    tipoOperazione: { type: String, required: true },
    ip: String,
    data: { type: Date, default: Date.now },
    esito: Boolean,
    dettaglio: String
});

auditLogSchema.set('toJSON', {
    virtuals: true,
    transform: (_, ret: any) => { 
        delete ret._id; 
        delete ret.__v;
        return ret;
    }
});

export const AuditLogModel = model <AuditLog> ('AuditLog', auditLogSchema);