import { SaldoInsufficienteError } from "../../errors/saldoInsufficienteError";
import { CategoriaMovimentoModel } from "../categorie-movimenti/categoria-movimento.model";
import { contoCorrenteModel } from "../registrazione/registrazione.model";
import { MovimentoContoCorrenteModel } from "./movimento-conto-corrente.model";

export class MovimentoContoCorrenteService {
  /**
   * Restituisce gli ultimi 5 movimenti del conto.
   */
  async getUltimiMovimenti(contoCorrenteID: string) {
    return MovimentoContoCorrenteModel.find({
      ContoCorrenteID: contoCorrenteID,
    })
      .sort({ Data: -1 })
      .limit(5);
  }

  /**
   * Restituisce un movimento appartenente a uno specifico conto.
   */
  async getMovimento(
    movimentoID: string,
    contoCorrenteID: string
  ) {
    return MovimentoContoCorrenteModel.findOne({
      MovimentoID: movimentoID,
      ContoCorrenteID: contoCorrenteID,
    });
  }

  /**
   * Restituisce il saldo dell'ultimo movimento.
   * Se il conto non ha movimenti, il saldo iniziale è 0.
   */
  async getSaldo(contoCorrenteID: string): Promise<number> {
    const ultimoMovimento =
      await MovimentoContoCorrenteModel
        .findOne({
          ContoCorrenteID: contoCorrenteID,
        })
        .sort({ Data: -1 });

    return ultimoMovimento?.Saldo ?? 0;
  }

  /**
   * Restituisce il conto associato a un movimento.
   */
  async getContoCorrente(movimentoID: string) {
    return MovimentoContoCorrenteModel.findOne({
      MovimentoID: movimentoID,
    });
  }

  /**
   * Crea una ricarica.
   *
   * La ricarica viene considerata un'uscita:
   * il saldo diminuisce e Importo è negativo.
   */
  async creaMovimentoRicarica(
    contoCorrenteID: string,
    importo: number,
    saldo: number,
    categoriaMovimentoID: string
  ) {
    this.verificaImporto(importo);

    if (importo > saldo) {
      throw new SaldoInsufficienteError(
        `Saldo insufficiente per una ricarica di ${importo}€`
      );
    }

    const nuovoSaldo = saldo - importo;

    return MovimentoContoCorrenteModel.create({
      ContoCorrenteID: contoCorrenteID,
      Importo: -importo,
      Saldo: nuovoSaldo,
      CategoriaMovimentoID: categoriaMovimentoID,
      DescrizioneEstesa: `Ricarica di ${importo}€`,
    });
  }

  /**
   * Crea un bonifico in uscita.
   */
  async uscita(
    contoCorrenteID: string,
    importo: number,
    categoriaMovimentoID: string,
    descrizione?: string
  ) {
    this.verificaImporto(importo);

    const saldoAttuale =
      await this.getSaldo(contoCorrenteID);

    if (importo > saldoAttuale) {
      throw new SaldoInsufficienteError(
        `Saldo insufficiente per un bonifico di ${importo}€`
      );
    }

    const nuovoSaldo = saldoAttuale - importo;

    return MovimentoContoCorrenteModel.create({
      ContoCorrenteID: contoCorrenteID,
      Importo: -importo,
      Saldo: nuovoSaldo,
      CategoriaMovimentoID: categoriaMovimentoID,
      DescrizioneEstesa:
        descrizione ??
        `Bonifico in uscita di ${importo}€`,
    });
  }

  /**
   * Crea un bonifico in entrata usando l'IBAN del destinatario.
   * Se è presente l'ordinante (IBAN del mittente) lo mostra nella
   * descrizione, seguito dalla descrizione scritta dall'utente.
   */
  async entrata(
    IBAN: string,
    importo: number,
    categoriaMovimentoID: string,
    ordinante?: string,
    descrizione?: string
  ) {
    this.verificaImporto(importo);

    const contoCorrente =
      await contoCorrenteModel.findOne({ IBAN });

    if (!contoCorrente) {
      throw new Error("Conto corrente non trovato");
    }

    const contoCorrenteID =
      contoCorrente.contoCorrenteId;

    const saldoAttuale =
      await this.getSaldo(contoCorrenteID);

    const nuovoSaldo = saldoAttuale + importo;

    const descrizioneUtente = descrizione?.trim();

    const descrizioneMovimento = ordinante
      ? `Bonifico in entrata di ${importo}€ da ${ordinante}` +
        (descrizioneUtente ? ` - ${descrizioneUtente}` : "")
      : descrizioneUtente || `Bonifico in entrata di ${importo}€`;

    return MovimentoContoCorrenteModel.create({
      ContoCorrenteID: contoCorrenteID,
      Importo: importo,
      Saldo: nuovoSaldo,
      CategoriaMovimentoID: categoriaMovimentoID,
      DescrizioneEstesa: descrizioneMovimento,
    });
  }

  /**
   * Crea un deposito.
   */
  async deposito(
    contoCorrenteID: string,
    importo: number,
    categoriaMovimentoID: string,
    descrizione?: string
  ) {
    this.verificaImporto(importo);

    const saldoAttuale =
      await this.getSaldo(contoCorrenteID);

    const nuovoSaldo = saldoAttuale + importo;

    return MovimentoContoCorrenteModel.create({
      ContoCorrenteID: contoCorrenteID,
      Importo: importo,
      Saldo: nuovoSaldo,
      CategoriaMovimentoID: categoriaMovimentoID,
      DescrizioneEstesa:
        descrizione ?? `Deposito di ${importo}€`,
    });
  }

  /**
   * Crea un prelievo.
   */
  async ritiro(
    contoCorrenteID: string,
    importo: number,
    categoriaMovimentoID: string,
    descrizione?: string
  ) {
    this.verificaImporto(importo);

    const saldoAttuale =
      await this.getSaldo(contoCorrenteID);

    if (importo > saldoAttuale) {
      throw new SaldoInsufficienteError(
        `Saldo insufficiente per un ritiro di ${importo}€`
      );
    }

    const nuovoSaldo = saldoAttuale - importo;

    return MovimentoContoCorrenteModel.create({
      ContoCorrenteID: contoCorrenteID,
      Importo: -importo,
      Saldo: nuovoSaldo,
      CategoriaMovimentoID: categoriaMovimentoID,
      DescrizioneEstesa:
        descrizione ?? `Ritiro di ${importo}€`,
    });
  }

  /**
   * Controlla che l'importo sia valido.
   */
  private verificaImporto(importo: number): void {
    if (!Number.isFinite(importo) || importo <= 0) {
      throw new Error(
        "L'importo deve essere un numero maggiore di zero"
      );
    }
  }
}

export default new MovimentoContoCorrenteService();