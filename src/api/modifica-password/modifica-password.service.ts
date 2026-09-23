import bcrypt from "bcrypt";
import { contoCorrenteModel } from "../registrazione/registrazione.model";

export class ModificaPasswordService {

    async modificaPassword(
        email: string,
        passwordAttuale: string,
        nuovaPassword: string,
        confermaPassword: string
    ) {

        const conto = await contoCorrenteModel.findOne({
            email: email.toLowerCase().trim()
        });

        if (!conto) {
            throw new Error("Utente non trovato");
        }

        const passwordCorretta = await bcrypt.compare(
            passwordAttuale,
            conto.password
        );

        if (!passwordCorretta) {
            throw new Error("Password attuale non corretta");
        }

        if (nuovaPassword !== confermaPassword) {
            throw new Error("Le nuove password non coincidono");
        }

        const nuovaPasswordHash = await bcrypt.hash(
            nuovaPassword,
            10
        );

        conto.password = nuovaPasswordHash;

        await conto.save();

        return {
            message: "Password modificata con successo."
        };

    }

}

export default new ModificaPasswordService();