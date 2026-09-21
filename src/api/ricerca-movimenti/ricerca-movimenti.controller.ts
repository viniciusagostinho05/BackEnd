import { Response, NextFunction } from 'express';
import { RicercaMovimentiQueryDto } from './ricerca-movimenti.dto';
import { ricercaMovimentiSrv } from './ricerca-movimenti.service';
import { TypedRequest } from '../../utils/typed-request';


export async function ricercaMovimentiHandler(
  req: TypedRequest<unknown, RicercaMovimentiQueryDto>,
  res: Response,
  next: NextFunction
) {
  try {
    const contoCorrenteId = (req.user as any).contoCorrenteId ?? (req.user as any).id;

    const result = await ricercaMovimentiSrv.cerca(
      contoCorrenteId,
      req.query as unknown as RicercaMovimentiQueryDto
    );

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}