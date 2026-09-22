import { Response, NextFunction } from "express";
import { CategoriaMovimentoModel } from "../categorie-movimenti/categoria-movimento.model";
import { TypedRequest } from "../utils/typed-request";
import { RicaricaDto } from "./ricarica.dto";
import MovimentoContoCorrenteService from "../movimento-conto-corrente/movimento-conto-corrente.service";
import auditLogSrv from "../utils/audit-log/audit-log.service";
import { SaldoInsufficienteError } from "../../errors/saldoInsufficienteError";

export const ricarica = async (req: TypedRequest<RicaricaDto>, res: Response, next: NextFunction) => {
  const contoCorrenteId = req.body.contoCorrenteId;
  const ip = req.ip!;
  try {
    const { numeroTelefonico, operatore, taglio } = req.body;

    // 1. deve esserci saldo disponibile
    const saldo = await MovimentoContoCorrenteService.getSaldo(contoCorrenteId);
    if (Number(saldo) < taglio) {
      throw new SaldoInsufficienteError('Saldo insufficiente');
    }

    // 2. la categoria deve essere stata caricata nel db (nome ESATTO: 'Ricarica')
    const categoria = await CategoriaMovimentoModel.findOne({ nomeCategoria: 'ricarica' });
    if (!categoria) {
      throw new Error("Categoria 'Ricarica' non presente nel database");
    }

    // 3. movimento di uscita
    const movimento = await MovimentoContoCorrenteService.creaMovimentoRicarica( contoCorrenteId, taglio, Number(saldo), categoria.categoriaMovimentoId);

    await auditLogSrv.registra({
      tipoOperazione: 'ricarica',
      ip,
      esito: true,
      contoCorrenteId: contoCorrenteId,
      dettaglio: `${taglio}€ ${operatore} ${numeroTelefonico}`
    });
    res.status(201).json(movimento);
  } catch (err) {
    await auditLogSrv.registra({
      tipoOperazione: 'ricarica',
      ip,
      esito: false,
      contoCorrenteId: contoCorrenteId,
      dettaglio: err instanceof Error ? err.message : 'errore sconosciuto'
    });
    next(err);
  }
}