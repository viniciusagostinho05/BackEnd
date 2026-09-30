import { NextFunction, Response } from "express";
import { SaldoInsufficienteError } from "../../errors/saldoInsufficienteError";
import { CategoriaMovimentoModel } from "../categorie-movimenti/categoria-movimento.model";
import { ContoCorrenteModel } from "../conto-corrente/conto-corrente.model";
import MovimentoContoCorrenteService from "../movimento-conto-corrente/movimento-conto-corrente.service";
import { TypedRequest } from "../utils/typed-request";
import auditLogService from "../utils/audit-log/audit-log.service";
import { BonificoDto } from "./bonifico.dto";
import mongoose from "mongoose";

export const bonifico = async (
  req: TypedRequest<BonificoDto>,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip ?? "unknown";
  const utente = req.user;

  const contoCorrenteMittenteID =
    utente?.contoCorrenteId &&
    mongoose.isValidObjectId(utente.contoCorrenteId)
      ? utente.contoCorrenteId
      : null;

  try {
    if (!utente) {
      throw new Error("Utente non autenticato");
    }

    if (!contoCorrenteMittenteID) {
      throw new Error(
        "Conto corrente del mittente non trovato"
      );
    }

    const {
      ibanDestinatario,
      importo,
      descrizione,
    } = req.body;

    if (!ibanDestinatario?.trim()) {
      throw new Error(
        "L'IBAN del destinatario è obbligatorio"
      );
    }

    if (!Number.isFinite(importo) || importo <= 0) {
      throw new Error(
        "L'importo deve essere un numero maggiore di zero"
      );
    }

    /*
     * 1. Cerco il conto destinatario tramite IBAN
     */
    const destinatario =
      await ContoCorrenteModel.findOne({
        IBAN: ibanDestinatario
      });

    if (!destinatario) {
      throw new Error("IBAN destinatario non trovato");
    }

    const contoCorrenteDestinatarioID = destinatario.contoCorrenteId;

    if (!contoCorrenteDestinatarioID) {
      throw new Error(
        "ID del conto destinatario non trovato"
      );
    }

    if (
      contoCorrenteDestinatarioID ===
      contoCorrenteMittenteID
    ) {
      throw new Error(
        "Non puoi fare un bonifico verso il tuo stesso conto"
      );
    }

    /*
     * 2. Recupero automaticamente le categorie
     */
    const categoriaUscita =
      await CategoriaMovimentoModel.findOne({
        nomeCategoria: "bonifico_uscita",
      });

    const categoriaEntrata =
      await CategoriaMovimentoModel.findOne({
        nomeCategoria: "bonifico_entrata",
      });

    if (!categoriaUscita || !categoriaEntrata) {
      throw new Error(
        "Categorie 'Bonifico Uscita' / " +
        "'Bonifico Entrata' non presenti nel database"
      );
    }

    /*
     * 3. Recupero gli ID delle categorie
     */
    const categoriaUscitaID =
      categoriaUscita.categoriaMovimentoId;

    const categoriaEntrataID =
      categoriaEntrata.categoriaMovimentoId;

    if (!categoriaUscitaID || !categoriaEntrataID) {
      throw new Error(
        "ID delle categorie di bonifico non validi"
      );
    }

    /*
     * 4. Recupero il saldo attuale del mittente
     */
    const saldoMittente =
      await MovimentoContoCorrenteService.getSaldo(
        contoCorrenteMittenteID
      );

    if (saldoMittente < importo) {
      throw new SaldoInsufficienteError(
        "Saldo insufficiente"
      );
    }

    /*
     * 5. Ricavo il nome dell'ordinante, se presente
     */
    // const nomeOrdinante = [
    //   utente.nome,
    //   utente.nomeTitolare,
    //   utente.cognome,
    //   utente.cognomeTitolare,
    // ]
    //   .filter(Boolean)
    //   .join(" ")
    //   .trim();

    /*
     * 6. Creo il movimento in uscita
     */
    const movimentoUscita =
      await MovimentoContoCorrenteService.uscita(
        contoCorrenteMittenteID,
        importo,
        categoriaUscitaID,
        descrizione
      );

    /*
     * 7. Creo il movimento in entrata
     */
    await MovimentoContoCorrenteService.entrata(
      destinatario.IBAN,
      importo,
      categoriaEntrataID,
      descrizione
    );

    await auditLogService.registra({
      tipoOperazione: "bonifico",
      ip,
      esito: true,
      contoCorrenteId: contoCorrenteMittenteID
    });

     res.status(201).json({
      message: "Bonifico eseguito correttamente",
      movimento: movimentoUscita
    });
      return;

  } catch (err) {
    await auditLogService.registra({
      tipoOperazione: "bonifico",
      ip,
      esito: false,
      contoCorrenteId: contoCorrenteMittenteID
    });

    return next(err);
  }
};