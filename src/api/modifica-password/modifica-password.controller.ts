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

        const email = req.user?.email;

        const {
            passwordAttuale,
            nuovaPassword,
            confermaPassword
        } = req.body;

        const risultato =
            await modificaPasswordService.modificaPassword(
                email!,
                passwordAttuale,
                nuovaPassword,
                confermaPassword
            );

        res.status(200).json(risultato);
            return;
    } catch (err: any) {

        if (
            err.message === "Utente non trovato" ||
            err.message === "Password attuale non corretta" ||
            err.message === "Le nuove password non coincidono"
        ) {
            res.status(400).json({
                message: err.message
            });
            return;
        }

        next(err);
    }

};