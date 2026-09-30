import { Response, NextFunction } from 'express';
import { categoriaMovimentoSrv } from './categoria-movimento.service';
import { TypedRequest } from '../utils/typed-request';
import { CercaCategoriaMovimentoDto, CreaCategoriaMovimentoDto } from './categoria-movimenti.dto';

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

export async function cercaCategoriaMovimentoHandler(
  req: TypedRequest<CercaCategoriaMovimentoDto>,
  res: Response,
  next: NextFunction
) {
  try {
    const nomeCategoria = await categoriaMovimentoSrv.cercaNomeCat();
    res.status(200).json(nomeCategoria);
  } catch (err) {
    next(err);
  }
}


export async function creaCategoriaMovimentoHandler(
  req: TypedRequest<CreaCategoriaMovimentoDto>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const categoria =
      await categoriaMovimentoSrv.crea(
        req.body
      );

    res.status(201).json(categoria);
  } catch (err) {
    next(err);
  }
}