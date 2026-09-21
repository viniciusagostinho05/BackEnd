import { Request, Response, NextFunction } from "express";
import contoCorrenteService from "./conto-corrente.service";

export const home = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const user = req.user as any;

        const home = await contoCorrenteService.getHome(
            user.ContoCorrenteID
        );

        if (!home) {
            return res.status(404).json({
                message: "Conto corrente non trovato."
            });
        }

        return res.json(home);

    } catch (err) {
        next(err);
    }
};