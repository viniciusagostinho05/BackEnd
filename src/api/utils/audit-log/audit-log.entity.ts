export interface AuditLog {
  id?: string;
  tipoOperazione: string;
  ip: string;
  esito: boolean;
  contoCorrenteId?: string | null;
  data?: Date;
}