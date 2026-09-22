import { AccessoModel } from "./accesso.model";

export class AccessoService {

    async registraAccesso(
        ip: string,
        accessoValido: boolean
    ) {

        return AccessoModel.create({
            IP: ip,
            dataOra: new Date(),
            accessoValido: accessoValido
        });

    }

}

export default new AccessoService();