import { MovimentoContoCorrenteModel } from "./movimento-conto-corrente.model";

export class MovimentoContoCorrenteService {

    async getUltimiMovimenti(contoCorrenteID: number) {

        return MovimentoContoCorrenteModel.find({
            ContoCorrenteID: contoCorrenteID
        })
            .sort({ Data: -1 })
            .limit(5);

    }

    async getMovimento(
        movimentoID: number,
        contoCorrenteID: number
    ) {

        return MovimentoContoCorrenteModel.findOne({
            MovimentoID: movimentoID,
            ContoCorrenteID: contoCorrenteID
        });

    }

}

export default new MovimentoContoCorrenteService();