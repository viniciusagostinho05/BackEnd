import { ContoCorrente } from "./conto-corrente.entity";
import { ContoCorrenteModel } from "./conto-corrente.model";
import movimentoContoCorrenteService from "../movimento-conto-corrente/movimento-conto-corrente.service";

export class ContoCorrenteService {

    async findByEmail(email: string): Promise<ContoCorrente | null> {
        return ContoCorrenteModel.findOne({
            Email: email
        });
    }

    async getHome(contoCorrenteID: number) {

        const conto = await ContoCorrenteModel.findOne({
            ContoCorrenteID: contoCorrenteID
        });

        if (!conto) {
            return null;
        }

        const ultimiMovimenti =
            await movimentoContoCorrenteService.getUltimiMovimenti(
                contoCorrenteID
            );

        const saldo =
            ultimiMovimenti.length > 0
                ? ultimiMovimenti[0].Saldo
                : 0;

        return {
            NomeTitolare: conto.NomeTitolare,
            CognomeTitolare: conto.CognomeTitolare,
            Saldo: saldo,
            UltimiMovimenti: ultimiMovimenti
        };

    }

}

export default new ContoCorrenteService();