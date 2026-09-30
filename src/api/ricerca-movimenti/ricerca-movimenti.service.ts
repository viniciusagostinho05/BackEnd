import { CategoriaMovimentoModel } from '../categorie-movimenti/categoria-movimento.model';
import { MovimentoContoCorrenteModel } from '../movimento-conto-corrente/movimento-conto-corrente.model';
import { RicercaMovimentiQueryDto } from './ricerca-movimenti.dto';
import { MovimentoRicercaResult } from './ricerca-movimenti.entity';

// CAMBIA questo import con il path/nome del tuo model categoria reale.
// Esempio ipotizzato:

const LIMITE_DEFAULT = 10;

interface CategoriaLean {
  CategoriaMovimentoID: string;
  NomeCategoria: string;
}

export class RicercaMovimentiService {
  async cerca(
    contoCorrenteId: string,
    query: RicercaMovimentiQueryDto
  ): Promise<MovimentoRicercaResult> {
    const { n, categoriaId, dataDa, dataA } = query;

    const limite =
      Number.isFinite(Number(n)) && Number(n) > 0
        ? Number(n)
        : LIMITE_DEFAULT;

    const nessunFiltro = !categoriaId && !dataDa && !dataA;

    /*
     * I campi di questo model sono stringhe:
     * - ContoCorrenteID
     * - CategoriaMovimentoID
     * - Data (ISO string)
     *
     * NON creare ObjectId qui.
     */
    const filtro: Record<string, unknown> = {
      ContoCorrenteID: contoCorrenteId,
    };

    if (categoriaId) {
      filtro.CategoriaMovimentoID = categoriaId;
    }

    /*
     * Data è salvata in formato ISO: "2026-09-23T12:29:07.447Z".
     * Le stringhe ISO UTC ordinate lessicograficamente mantengono l'ordine
     * cronologico, quindi $gte/$lte funzionano se tutte le date hanno
     * quel formato.
     */
    if (dataDa || dataA) {
      const filtroData: Record<string, string> = {};

      if (dataDa) {
        filtroData.$gte = new Date(dataDa).toISOString();
      }

      if (dataA) {
        const fineGiornata = new Date(dataA);
        fineGiornata.setUTCHours(23, 59, 59, 999);
        filtroData.$lte = fineGiornata.toISOString();
      }

      filtro.Data = filtroData;
    }

    const movimentiDocs = await MovimentoContoCorrenteModel.find(filtro)
      .sort({ Data: -1, _id: -1 })
      .limit(limite)
      .lean();

    /*
     * Recuperiamo tutte le categorie usate dai movimenti trovati.
     * Serve perché CategoriaMovimentoID è una stringa e non può essere
     * popolata automaticamente da Mongoose.
     */
    const categoriaIds = [
      ...new Set(
        movimentiDocs
          .map((m) => m.CategoriaMovimentoID)
          .filter((id): id is string => Boolean(id))
      ),
    ];

    const categorie = await CategoriaMovimentoModel.find({
      CategoriaMovimentoID: { $in: categoriaIds },
    })
      .select('CategoriaMovimentoID NomeCategoria')
      .lean<CategoriaLean[]>();

    const categoriePerId = new Map(
      categorie.map((categoria) => [
        categoria.CategoriaMovimentoID,
        categoria.NomeCategoria,
      ])
    );

    const movimenti = movimentiDocs.map((m) => ({
      data: m.Data,
      importo: m.Importo,
      nomeCategoria:
        categoriePerId.get(m.CategoriaMovimentoID) ?? 'Senza categoria',
      descrizioneEstesa: m.DescrizioneEstesa,
    }));

    const result: MovimentoRicercaResult = { movimenti };

    /*
     * Il saldo viene restituito soltanto senza filtri, come nel requisito
     * che avevi implementato prima.
     */
    if (nessunFiltro) {
      const ultimo = await MovimentoContoCorrenteModel.findOne({
        ContoCorrenteID: contoCorrenteId,
      })
        .sort({ Data: -1, _id: -1 })
        .select('Saldo')
        .lean<{ Saldo?: number }>();

      result.saldo = ultimo?.Saldo ?? 0;
    }

    return result;
  }
}

export const ricercaMovimentiSrv = new RicercaMovimentiService();