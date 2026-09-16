import { Response, NextFunction } from "express";
import { TypedRequest } from "../../lib/typed-request.interface";
import { RicaricaDto } from "./ricarica.dto";
import movimentoSrv from "../movimento/movimento.service";
import { CategoriaMovimentoModel } from "../categoria-movimento/categoria-movimento.model";
import auditLogSrv from "../../lib/audit-log/utils/audit-log.service";

export const ricarica = async (req: TypedRequest <RicaricaDto>, res: Response, next: NextFunction) => {
    const ip = req.ip ?? ' unknown';
    const contoId = (req as any).user.id;

    try{
        const categoria = await CategoriaMovimentoModel.findOne({ nomeCategoria: 'Ricarica '});
        const movimento = await movimentoSrv.creaMovimento(
            contoId,
            -req.body.taglio,
            categoria!.id,
            `Ricarica ${req.body.operatore} ${req.body.numeroTelefonico}`
        );
        
        await auditLogSrv.registra({ tipoOperazione: 'ricarica', ip, esito: true, contoCorrenteId: contoId});
        res.status(201).json(movimento);
    }
    catch(err){
        await auditLogSrv.registra({ tipoOperazione: 'ricarica', ip, esito: false, contoCorrenteId: contoId });
        next(err);
    }
}