import { Response, NextFunction } from "express";
import { TypedRequest } from "../../lib/audit-log/typed-request.interface";
import { RicaricaDto } from "./ricarica.dto";
import movimentoSrv from "../movimento/movimento.service";
import { CategoriaMovimentoModel } from "../categoria-movimento/categoria-movimento.model";
import { BusinessError } from "../../errors/business-error";
import auditLogSrv from "../../lib/audit-log/utils/audit-log.service";

export const ricarica = async (req: TypedRequest<RicaricaDto>, res: Response, next: NextFunction) => {
  const ip = req.ip ?? 'unknown';
  const contoId = (req as any).user.id;

  try {
    const { numeroTelefonico, operatore, taglio } = req.body;

    // 1. deve esserci saldo disponibile
    const saldo = await movimentoSrv.getSaldo(contoId);
    if (saldo < taglio) {
      throw new BusinessError('Saldo insufficiente');
    }

    // 2. la categoria deve essere stata caricata nel db (nome ESATTO: 'Ricarica')
    const categoria = await CategoriaMovimentoModel.findOne({ nomeCategoria: 'Ricarica' });
    if (!categoria) {
      throw new Error("Categoria 'Ricarica' non presente nel database");
    }

    // 3. movimento di uscita
    const movimento = await movimentoSrv.creaMovimento(
      contoId,
      -taglio,
      categoria.id,
      `Ricarica ${operatore} numero ${numeroTelefonico}`
    );

    await auditLogSrv.registra({
      tipoOperazione: 'ricarica',
      ip,
      esito: true,
      contoCorrenteId: contoId,
      dettaglio: `${taglio} € ${operatore} ${numeroTelefonico}`
    });
    res.status(201).json(movimento);
  } catch (err) {
    await auditLogSrv.registra({
      tipoOperazione: 'ricarica',
      ip,
      esito: false,
      contoCorrenteId: contoId,
      dettaglio: err instanceof Error ? err.message : 'errore sconosciuto'
    });
    next(err);
  }
}
