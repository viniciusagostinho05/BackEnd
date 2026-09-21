import { Response, NextFunction } from 'express';
import { categoriaMovimentoSrv } from './categoria-movimento.service';
import { TypedRequest } from '../../utils/typed-request';

export async function categoriaMovimentoHandler(
  req: TypedRequest<unknown, unknown, unknown>,
  res: Response,
  next: NextFunction
) {
  try {
    const categorie = await categoriaMovimentoSrv.elenco();
    res.status(200).json(categorie);
  } catch (err) {
    next(err);
  }
}