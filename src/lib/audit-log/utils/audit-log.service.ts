import { AuditLogModel } from "./utils/audit-log.model";
import { AuditLog } from "./utils/audit-log.entity";

export class AuditLogService {
    async registra (dati: Omit<AuditLog, 'id' | 'data'>) {
        return AuditLogModel.create({
            ...dati, 
            data: new Date()
        });
    }
}

export default new AuditLogService();