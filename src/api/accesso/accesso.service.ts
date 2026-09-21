import { AccessoModel } from "./accesso.model";

export class AccessoService {

    async registraAccesso(
        ip: string,
        accessoValido: boolean
    ) {

        return AccessoModel.create({
            IP: ip,
            DataOra: new Date(),
            AccessoValido: accessoValido
        });

    }

}

export default new AccessoService();