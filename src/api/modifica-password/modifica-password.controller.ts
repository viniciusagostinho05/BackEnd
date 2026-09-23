import { Response, NextFunction } from "express";
import { TypedRequest } from "../utils/typed-request";
import { ModificaPasswordDto } from "./modifica-password.dto";
import modificaPasswordService from "./modifica-password.service";

export const modificaPassword = async (
    req: TypedRequest<ModificaPasswordDto>,
    res: Response,
    next: NextFunction
) => {

    try {

        const user = req.user as any;

        const {
            passwordAttuale,
            nuovaPassword,
            confermaPassword
        } = req.body;

        const risultato =
            await modificaPasswordService.modificaPassword(
                user.email,
                passwordAttuale,
                nuovaPassword,
                confermaPassword
            );

        return res.status(200).json(risultato);

    } catch (err: any) {

        if (
            err.message === "Utente non trovato" ||
            err.message === "Password attuale non corretta" ||
            err.message === "Le nuove password non coincidono"
        ) {
            return res.status(400).json({
                message: err.message
            });
        }

        next(err);
    }

};