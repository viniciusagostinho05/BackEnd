import { AuditLogModel } from "./audit-log.model";
import { AuditLog } from "./audit-log.entity";

export class AuditLogService {
  async registra(
    dati: Omit<AuditLog, "id" | "data">
  ) {
    return AuditLogModel.create(dati);
  }
}

export default new AuditLogService();