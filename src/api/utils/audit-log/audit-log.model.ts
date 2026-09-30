import { Schema, model } from "mongoose";
import { AuditLog } from "./audit-log.entity";

const auditLogSchema = new Schema<AuditLog>(
  {
    tipoOperazione: {
      type: String,
      required: true,
      trim: true,
    },

    ip: {
      type: String,
      required: true,
      trim: true,
    },

    esito: {
      type: Boolean,
      required: true,
    },

    contoCorrenteId: {
      type: Schema.Types.ObjectId,
      ref: "ContoCorrente",
      required: false,
      default: null,
    },

    data: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

export const AuditLogModel = model<AuditLog>(
  "AuditLog",
  auditLogSchema
);