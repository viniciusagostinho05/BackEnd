import { Types } from 'mongoose';
import { RicercaMovimentiQueryDto } from './ricerca-movimenti.dto';
import { MovimentoRicercaResult } from './ricerca-movimenti.entity';
import { MovimentoModel } from './ricerca-movimenti.model';

export class RicercaMovimentiService {
  async cerca(
    contoCorrenteId: string,
    query: RicercaMovimentiQueryDto
  ): Promise<MovimentoRicercaResult> {
    const { n, categoriaId, dataDa, dataA } = query;

    // Nessun controllo di esclusione qui: già garantito dal DTO/validation-middleware.

    const nessunFiltro = !categoriaId && !dataDa && !dataA;

    const filtro: Record<string, unknown> = {
      contoCorrenteId: new Types.ObjectId(contoCorrenteId),
    };
    if (categoriaId) {
      filtro.categoriaMovimentoId = new Types.ObjectId(categoriaId);
    }
    if (dataDa && dataA) {
      const fineGiornata = new Date(dataA);
      fineGiornata.setUTCHours(23, 59, 59, 999);
      filtro.data = { $gte: new Date(dataDa), $lte: fineGiornata };
    }

    const movimentiDocs = await MovimentoModel.find(filtro)
      .sort({ data: -1 })
      .limit(n)
      .populate('categoriaMovimentoId', 'nomeCategoria')
      .lean();

    const movimenti = movimentiDocs.map((m: any) => ({
      data: m.data,
      importo: m.importo,
      nomeCategoria: m.categoriaMovimentoId?.nomeCategoria ?? '',
    }));

    const result: MovimentoRicercaResult = { movimenti };

    if (nessunFiltro) {
      const ultimo = await MovimentoModel.findOne({
        contoCorrenteId: new Types.ObjectId(contoCorrenteId),
      })
        .sort({ data: -1 })
        .select('saldo')
        .lean();
      result.saldo = (ultimo as any)?.saldo ?? 0;
    }

    return result;
  }
}

export const ricercaMovimentiSrv = new RicercaMovimentiService();