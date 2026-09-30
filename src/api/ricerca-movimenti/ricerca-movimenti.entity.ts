export interface Movimento {
  _id: string;
  contoCorrenteId: string;
  data: string;
  importo: number;
  saldo: number;
  categoriaMovimentoId: string;
  descrizioneEstesa: string;
}

export interface MovimentoRicercaItem {
  data: string;
  importo: number;
  nomeCategoria: string;
}

export interface MovimentoRicercaResult {
  // presente SOLO quando la ricerca è senza filtri
  saldo?: number;
  movimenti: MovimentoRicercaItem[];
}