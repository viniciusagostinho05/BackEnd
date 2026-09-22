export interface AuditLog {
    id: string;
    contoCorrenteId?: string;
    tipoOperazione: 'login' | 'ricarica' | 'bonifico' | 'cambio-password';
    ip: string;
    data: Date;
    esito: boolean;
    dettaglio?: string;
}