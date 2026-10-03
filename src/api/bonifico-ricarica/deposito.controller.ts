// deposito.controller.ts
import { NextFunction, Response } from "express";
import mongoose from "mongoose";
import { CategoriaMovimentoModel } from "../categorie-movimenti/categoria-movimento.model";
import MovimentoContoCorrenteService from "../movimento-conto-corrente/movimento-conto-corrente.service";
import { TypedRequest } from "../utils/typed-request";
import auditLogService from "../utils/audit-log/audit-log.service";
import { DepositoDto } from "./deposito.dto";

export const deposito = async (
  req: TypedRequest<DepositoDto>,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip ?? "unknown";
  const utente = req.user;

  const contoCorrenteID =
    utente?.contoCorrenteId && mongoose.isValidObjectId(utente.contoCorrenteId)
      ? utente.contoCorrenteId
      : null;

  try {
    if (!utente) throw new Error("Utente non autenticato");
    if (!contoCorrenteID) throw new Error("Conto corrente non trovato");

    const { importo, descrizione } = req.body;

    const categoria = await CategoriaMovimentoModel.findOne({
      nomeCategoria: "deposito",
    });

    if (!categoria?.categoriaMovimentoId) {
      throw new Error("Categoria 'deposito' non presente nel database");
    }

    const movimento = await MovimentoContoCorrenteService.deposito(
      contoCorrenteID,
      importo,
      categoria.categoriaMovimentoId,
      descrizione?.trim() || undefined // "" diventerebbe una descrizione vuota: così scatta il default
    );

    await auditLogService.registra({
      tipoOperazione: "deposito",
      ip,
      esito: true,
      contoCorrenteId: contoCorrenteID,
    });

    res.status(201).json({
      message: "Deposito eseguito correttamente",
      movimento,
    });
  } catch (err) {
    await auditLogService.registra({
      tipoOperazione: "deposito",
      ip,
      esito: false,
      contoCorrenteId: contoCorrenteID,
    });
    return next(err);
  }
};