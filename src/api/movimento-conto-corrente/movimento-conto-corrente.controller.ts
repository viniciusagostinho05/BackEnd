import { Request, Response, NextFunction } from "express";
import movimentoContoCorrenteService from "./movimento-conto-corrente.service";

export const dettaglioMovimento = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const user = req.user as any;

        const movimentoID = Number(req.params.id);

        const movimento =
            await movimentoContoCorrenteService.getMovimento(
                movimentoID,
                user.ContoCorrenteID
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