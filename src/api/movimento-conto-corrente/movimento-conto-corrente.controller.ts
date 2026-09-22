import { Request, Response, NextFunction } from "express";
import movimentoContoCorrenteService from "./movimento-conto-corrente.service";
import { TypedRequest } from "../utils/typed-request";
import { DepositoDto } from "./movimento-conto-corrente.dto";
import { IdParams } from "../utils/id-params";

export const dettaglioMovimento = async (
    req: TypedRequest<unknown, unknown, IdParams>,
    res: Response,
    next: NextFunction
) => {
    try {

        const movimentoID = req.params.id;
        const contoCorrente = await movimentoContoCorrenteService.getContoCorrente(movimentoID);
        const contoCorrenteID = contoCorrente?.ContoCorrenteID
        const movimento =
            await movimentoContoCorrenteService.getMovimento(
                movimentoID,
                contoCorrenteID!
            );

        if (!movimento) {
            return res.status(404).json({
                message: "Movimento non trovato."
            });
        }

        return res.json(movimento);

    } catch (err) {
        next(err);
    }
};

export const deposito = async ( req: TypedRequest<DepositoDto>, res: Response, next: NextFunction ): Promise<void> => {
  try {
    const { contoCorrenteId, importo, categoriaId, descrizione } = req.body;

    const nuovoDeposito =
      await movimentoContoCorrenteService.deposito(
        contoCorrenteId,
        importo,
        categoriaId,
        descrizione
      );

    res.status(201).json({
      message: 'Deposito creato con successo',
      deposito: nuovoDeposito,
    });
  } catch (err) {
    next(err);
  }
};

export const ritiro = async ( req: Request,res: Response, next: NextFunction ) => {
    try {
        const movimentoID = req.params.id;
        const contoCorrente = await movimentoContoCorrenteService.getContoCorrente(movimentoID);
        const contoCorrenteID = contoCorrente?.ContoCorrenteID
        const movimento =
            await movimentoContoCorrenteService.getMovimento(
                movimentoID,
                contoCorrenteID!
            );

        if (!movimento) {
            return res.status(404).json({
                message: "Movimento non trovato."
            });
        }

        return res.json(movimento);

    } catch (err) {
        next(err);
    }
};
