import { Response, NextFunction } from 'express';
import { RicercaMovimentiQueryDto } from './ricerca-movimenti.dto';
import { ricercaMovimentiSrv } from './ricerca-movimenti.service';
import { AuthRequest } from '../auth/auth.middleware';


export async function ricercaMovimentiHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const contoCorrenteId = req.user.contoCorrenteId;

    const result = await ricercaMovimentiSrv.cerca(
      contoCorrenteId,
      req.query as unknown as RicercaMovimentiQueryDto
    );

    res.status(200).json(result);
  } catch (err) { 
    next(err);
  }
}