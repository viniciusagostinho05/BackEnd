import { Response, NextFunction } from "express";
import { TypedRequest } from "../../lib/audit-log/typed-request.interface";
import { BonificoDto } from "./bonifico.dto";
import movimentoSrv from "../movimento/movimento.service";
import { ContoCorrenteModel } from "../conto-corrente/conto-corrente.model";
import { CategoriaMovimentoModel } from "../categoria-movimento/categoria-movimento.model";
import { BusinessError } from "../../errors/business-error";
import auditLogService from "../../lib/audit-log/utils/audit-log.service";

export const bonifico = async (req: TypedRequest<BonificoDto>, res: Response, next: NextFunction) => {
  const ip = req.ip ?? 'unknown';
  const mittente = (req as any).user;

  try {
    const { ibanDestinatario, importo } = req.body;

    // 1. l'IBAN deve esistere
    const destinatario = await ContoCorrenteModel.findOne({ iban: ibanDestinatario });
    if (!destinatario) {
      throw new BusinessError('IBAN destinatario non trovato');
    }
    if (destinatario.id === mittente.id) {
      throw new BusinessError('Non puoi fare un bonifico verso il tuo stesso conto');
    }

    // 2. deve esserci saldo disponibile
    const saldo = await movimentoSrv.getSaldo(mittente.id);
    if (saldo < importo) {
      throw new BusinessError('Saldo insufficiente');
    }

    // 3. le categorie devono essere state caricate nel db
    const categoriaUscita = await CategoriaMovimentoModel.findOne({ nomeCategoria: 'Bonifico Uscita' });
    const categoriaEntrata = await CategoriaMovimentoModel.findOne({ nomeCategoria: 'Bonifico Entrata' });
    if (!categoriaUscita || !categoriaEntrata) {
      throw new Error("Categorie 'Bonifico Uscita' / 'Bonifico Entrata' non presenti nel database");
    }

    // 4. i due movimenti (uscita per il mittente, entrata per il destinatario)
    const movimentoUscita = await movimentoSrv.creaMovimento(
      mittente.id,
      -importo,
      categoriaUscita.id,
      `Bonifico disposto a favore di ${destinatario.nomeTitolare} ${destinatario.cognomeTitolare}`
    );
    await movimentoSrv.creaMovimento(
      destinatario.id,
      importo,
      categoriaEntrata.id,
      `Bonifico disposto da ${mittente.nomeTitolare} ${mittente.cognomeTitolare}`
    );

    await auditLogSrv.registra({
      tipoOperazione: 'bonifico',
      ip,
      esito: true,
      contoCorrenteId: mittente.id,
      dettaglio: `${importo} € verso ${ibanDestinatario}`
    });
    res.status(201).json(movimentoUscita);
  } catch (err) {
    await auditLogSrv.registra({
      tipoOperazione: 'bonifico',
      ip,
      esito: false,
      contoCorrenteId: mittente.id,
      dettaglio: err instanceof Error ? err.message : 'errore sconosciuto'
    });
    next(err);
  }
}
