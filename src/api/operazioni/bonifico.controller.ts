import { Response, NextFunction } from "express";
import { TypedRequest } from "../../lib/typed-request.interface";
import { BonificoDto } from "./bonifico.dto";
import movimentoSrv from "../movimento/movimento.service";
import { ContoCorrenteModel } from "../conto-corrente/conto-corrente.model"; // fatto da Persona 1
import { CategoriaMovimentoModel } from "../categoria-movimento/categoria-movimento.model";
import { BusinessError } from "../../errors/business-error";
import auditLogSrv from "../../utils/audit-log/audit-log.service";

export const bonifico = async (req: TypedRequest<BonificoDto>, res: Response, next: NextFunction) => {
  const ip = req.ip ?? 'unknown';
  const mittente = (req as any).user;
  try {
    const destinatario = await ContoCorrenteModel.findOne({ iban: req.body.ibanDestinatario });
    if (!destinatario) throw new BusinessError('IBAN destinatario non trovato');

    const categoriaUscita = await CategoriaMovimentoModel.findOne({ nomeCategoria: 'Bonifico Uscita' });
    const categoriaEntrata = await CategoriaMovimentoModel.findOne({ nomeCategoria: 'Bonifico Entrata' });

    await movimentoSrv.creaMovimento(
      mittente.id, -req.body.importo, categoriaUscita!.id,
      `Bonifico disposto a favore di ${destinatario.nomeTitolare} ${destinatario.cognomeTitolare}`
    );
    await movimentoSrv.creaMovimento(
      destinatario.id, req.body.importo, categoriaEntrata!.id,
      `Bonifico disposto da ${mittente.nomeTitolare} ${mittente.cognomeTitolare}`
    );

    await auditLogSrv.registra({ tipoOperazione: 'bonifico', ip, esito: true, contoCorrenteId: mittente.id });
    res.status(201).json({ message: 'bonifico eseguito' });
  } catch(err) {
    await auditLogSrv.registra({ tipoOperazione: 'bonifico', ip, esito: false, contoCorrenteId: mittente.id });
    next(err);
  }
}