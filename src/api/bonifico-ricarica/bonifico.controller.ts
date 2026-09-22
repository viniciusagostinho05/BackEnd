import { Response, NextFunction } from "express";
import MovimentoContoCorrenteService from "../movimento-conto-corrente/movimento-conto-corrente.service";
import auditLogService from "../utils/audit-log/audit-log.service";
import { CategoriaMovimentoModel } from "../categorie-movimenti/categoria-movimento.model";
import { ContoCorrenteModel } from "../conto-corrente/conto-corrente.model";
import { TypedRequest } from "../utils/typed-request";
import { BonificoDto } from "./bonifico.dto";
import { error } from "node:console";
import { SaldoInsufficienteError } from "../../errors/saldoInsufficienteError";
import { contoCorrenteModel } from "../registrazione/registrazione.model";

export const bonifico = async (req: TypedRequest<BonificoDto>, res: Response, next: NextFunction) => {
  const ip = req.ip ?? 'unknown';
  const mittente = (req as any).user;

  try {
    const { ibanDestinatario, importo } = req.body;

  // 1. l'IBAN deve esistere
  const destinatario = await ContoCorrenteModel.findOne({ IBAN: ibanDestinatario });
  if (!destinatario) {
    throw new Error('IBAN destinatario non trovato');
  }
  if (destinatario.ContoCorrenteID === mittente.ContoCorrenteID) {
    throw new Error('Non puoi fare un bonifico verso il tuo conto');
  }

  const ordinante = await contoCorrenteModel.findOne({ contoCorrenteId: mittente.contoCorrenteID });
  const nomeOrdinante = `${ordinante?.nomeTitolare} ${ordinante?.cognomeTitolare}`;
    // 2. deve esserci saldo disponibile
    const saldo = await MovimentoContoCorrenteService.getSaldo(mittente.contoCOrre);
    if (importo > 0) {
      if(Number(saldo) < importo) {
        throw new SaldoInsufficienteError('Saldo insufficiente');
      }
    }

    // 3. le categorie devono essere state caricate nel db
    const categoriaUscita = await CategoriaMovimentoModel.findOne({ nomeCategoria: 'Bonifico Uscita' });
    const categoriaEntrata = await CategoriaMovimentoModel.findOne({ nomeCategoria: 'Bonifico Entrata' });
    if (!categoriaUscita || !categoriaEntrata) {
      throw new Error("Categorie 'Bonifico Uscita' / 'Bonifico Entrata' non presenti nel database");
    }

    // 4. i due movimenti (uscita per il mittente, entrata per il destinatario)
    const movimentoUscita = await MovimentoContoCorrenteService.uscita( mittente.ContoCorrenteID, importo, Number(saldo), categoriaUscita.id );
    await MovimentoContoCorrenteService.entrata( destinatario.IBAN, importo, categoriaEntrata.categoriaMovimentoId, Number(saldo), nomeOrdinante );

    await auditLogService.registra({
      tipoOperazione: 'bonifico',
      ip,
      esito: true,
      contoCorrenteId: mittente.id,
      dettaglio: `${importo} € verso ${ibanDestinatario}`
    });
    res.status(201).json(movimentoUscita);
  } catch (err) {
    await auditLogService.registra({
      tipoOperazione: 'bonifico',
      ip,
      esito: false,
      contoCorrenteId: mittente.id,
      dettaglio: err instanceof Error ? err.message : 'errore sconosciuto'
    });
    next(err);
  }
}