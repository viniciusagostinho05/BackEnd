import { CategoriaMovimentoModel } from './categoria-movimento.model';
import { CategoriaMovimento } from './categoria-movimento.entity';

export class CategoriaMovimentoService {

  async elenco(): Promise<CategoriaMovimento[]> {
    const docs = await CategoriaMovimentoModel.find().sort({ nomeCategoria: 1 }).lean();
    return docs.map((d: any) => ({
      _id: d._id.toString(),
      nomeCategoria: d.nomeCategoria,
      tipologia: d.tipologia,
    }));
  }
}

export const categoriaMovimentoSrv = new CategoriaMovimentoService();