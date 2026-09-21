export interface Movimento {
  _id: string;
  contoCorrenteId: string;
  data: Date;
  importo: number;
  saldo: number;
  categoriaMovimentoId: string;
  descrizioneEstesa: string;
}

export interface MovimentoRicercaItem {
  data: Date;
  importo: number;
  nomeCategoria: string;
}

export interface MovimentoRicercaResult {
  // presente SOLO quando la ricerca è senza filtri
  saldo?: number;
  movimenti: MovimentoRicercaItem[];
}