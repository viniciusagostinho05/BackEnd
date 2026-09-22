import { CategoriaMovimentoModel } from './categoria-movimento.model';
import { CategoriaMovimento } from './categoria-movimento.entity';
import { CreaCategoriaMovimentoDto } from './categoria-movimenti.dto';

export class CategoriaMovimentoService {
  async elenco(): Promise<CategoriaMovimento[]> {
    const docs =
      await CategoriaMovimentoModel
        .find()
        .sort({ nomeCategoria: 1 })
        .lean();

    return docs.map((d) => ({
      categoriaMovimentoId:
        d.categoriaMovimentoId,
      nomeCategoria:
        d.nomeCategoria,
      tipologia:
        d.tipologia,
    }));
  }

  async crea(
    data: CreaCategoriaMovimentoDto
  ) {
    const categoria =
      await CategoriaMovimentoModel.create({
        nomeCategoria: data.nomeCategoria,
        tipologia: data.tipologia,
      });

    return {
      categoriaMovimentoId:
        categoria.categoriaMovimentoId,
      nomeCategoria:
        categoria.nomeCategoria,
      tipologia:
        categoria.tipologia,
    };
  }
}

export const categoriaMovimentoSrv =
  new CategoriaMovimentoService();