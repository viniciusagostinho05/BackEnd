import { NextFunction } from "express";
import { SaldoInsufficienteError } from "../../errors/saldoInsufficienteError";
import { CategoriaMovimentoModel } from "../categorie-movimenti/categoria-movimento.model";
import { contoCorrenteModel } from "../registrazione/registrazione.model";
import { TypedRequest } from "../utils/typed-request";
import { DepositoDto } from "./movimento-conto-corrente.dto";
import { MovimentoContoCorrenteModel } from "./movimento-conto-corrente.model";

export class MovimentoContoCorrenteService {

    async getUltimiMovimenti(contoCorrenteID: string) {

        return MovimentoContoCorrenteModel.find({
            ContoCorrenteID: contoCorrenteID
        })
            .sort({ Data: -1 })
            .limit(5);

    }

    async getMovimento(
        movimentoID: string,
        contoCorrenteID: string
    ) {

        return MovimentoContoCorrenteModel.findOne({
            MovimentoID: movimentoID,
            ContoCorrenteID: contoCorrenteID
        });

    }

    async getSaldo(contoCorrenteId: string) {
        const ultimoMovimento = await MovimentoContoCorrenteModel
        .findOne({ ContoCorrenteID: contoCorrenteId })
        .sort({ Data: -1 });

        const saldoAttuale = ultimoMovimento?.Saldo;
    }

    async getContoCorrente(movimentoId: string){
        return MovimentoContoCorrenteModel.findOne({ MovimentoID: movimentoId});
    }

    async creaMovimentoRicarica(contoCorrenteId: string, taglio: number, saldo: number, categoriaId: string) {
        if (taglio > saldo) {
            throw new SaldoInsufficienteError(`${saldo} non sufficiente per una ricarica di ${taglio}`);
        }

        const nuovoSaldo = saldo - taglio;

        const movimento = await MovimentoContoCorrenteModel.create({
            ContoCorrenteID: contoCorrenteId,
            Importo: taglio,
            Saldo: nuovoSaldo,
            CategoriaMovimentoID: categoriaId,
            DescrizioneEstesa: `Ricarica di ${taglio}€`,
        });

        return movimento;
    }

    async uscita(contoCorrenteId: string, taglio: number, saldo: number, categoriaId: string) {
        if (taglio > saldo) {
            throw new SaldoInsufficienteError(`Saldo non sufficente per un bonifco di ${taglio}€`);
        }

        const nuovoSaldo = saldo - taglio;

        const movimento = await MovimentoContoCorrenteModel.create({
            ContoCorrenteID: contoCorrenteId,
            Importo: taglio,
            Saldo: nuovoSaldo,
            CategoriaMovimentoID: categoriaId,
            DescrizioneEstesa: `Bonifico in uscita di ${taglio}€`,
        });

        return movimento;
    }

    async entrata(IBAN: string, importo: number, categoriaId: string, saldo: number, ordinante?: string) {

        const nuovoSaldo = saldo + importo;

        const categoria = await CategoriaMovimentoModel.findOne({ CategoriaMovimentoId: categoriaId });
        if (!categoria) {
            throw new Error("Categoria non presente nel database");
        }

        const contoCorrente = await contoCorrenteModel.findOne({ IBAN });
        if (!contoCorrente) {
            throw new Error("Conto corrente non trovato");
        }

        const movimento = await MovimentoContoCorrenteModel.create({
            ContoCorrenteID: contoCorrente.contoCorrenteId,
            Importo: importo,
            Saldo: nuovoSaldo,
            DescrizioneEstesa: ordinante 
            ? `Bonifico in entrata di ${importo}€ da ${ordinante}`
            : `Bonifico in entrata di ${importo}€`,
            CategoriaMovimentoID: categoriaId
        });

        return movimento;
    }
    
    async deposito(
  contoCorrenteID: string,
  importo: number,
  categoriaMovimentoID: string,
  descrizione?: string
) {
  if (importo <= 0) {
    throw new Error(
      'L’importo del deposito deve essere maggiore di zero'
    );
  }

  const saldoAttuale =
    await this.getSaldo(contoCorrenteID);

  const nuovoSaldo =
    Number(saldoAttuale) + importo;

  const movimento =
    await MovimentoContoCorrenteModel.create({
      ContoCorrenteID: contoCorrenteID,
      Importo: importo,
      Saldo: nuovoSaldo,
      CategoriaMovimentoID:
        categoriaMovimentoID,
      DescrizioneEstesa:
        descrizione ??
        `Deposito di ${importo}€`,
    });

  return movimento;
}

async ritiro(contoCorrenteID: string, importo: number, categoriaMovimentoID: string, descrizione?: string) {
  if (importo <= 0) {
    throw new Error(
      'L’importo del ritiro deve essere maggiore di zero'
    );
  }

  const saldoAttuale =
    await this.getSaldo(contoCorrenteID);

  if (importo > Number(saldoAttuale)) {
    throw new SaldoInsufficienteError(
      `Saldo insufficiente per un ritiro di ${importo}€`
    );
  }

  const nuovoSaldo =
    Number(saldoAttuale) - importo;

  const movimento =
    await MovimentoContoCorrenteModel.create({
      ContoCorrenteID: contoCorrenteID,
      Importo: -importo,
      Saldo: nuovoSaldo,
      CategoriaMovimentoID:
        categoriaMovimentoID,
      DescrizioneEstesa:
        descrizione ??
        `Ritiro di ${importo}€`,
    });

  return movimento;
}

}

export default new MovimentoContoCorrenteService();