import nodemailer from "nodemailer";
import { CategoriaMovimentoModel } from "../categorie-movimenti/categoria-movimento.model";
import { ContoCorrenteModel } from "../conto-corrente/conto-corrente.model";
import { MovimentoContoCorrenteModel } from "../movimento-conto-corrente/movimento-conto-corrente.model";
import { VerificaEmailModel } from "./verfica-email.model";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export class VerificaEmailService {
  async  sendVerificationEmail(
    email: string,
    token: string
  ): Promise<void> {
    const verificationUrl =
    `${process.env.API_URL}/api/verify-email?token=${encodeURIComponent(token)}`;

      console.log('LINK DI VERIFICA:', verificationUrl);
      
    await transporter.sendMail({
      from: `"La mia applicazione" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: 'Verifica il tuo indirizzo email',
      text: `Verifica il tuo account aprendo questo link: ${verificationUrl}`,
      html: `
        <h2>Verifica il tuo account</h2>
        <p>Per completare la registrazione clicca sul seguente pulsante:</p>

        <a href="${verificationUrl}"
          style="
            display:inline-block;
            padding:12px 20px;
            background:#2563eb;
            color:white;
            text-decoration:none;
            border-radius:6px;
          ">
          Verifica email
        </a>

        <p>Il link scadrà tra 24 ore.</p>
      `,
    });
  }

  async VerificaEmail (
    token: string
  ): Promise<string> {
    const verificaEmail =
      await VerificaEmailModel.findOne({
        token,
      });

    if (!verificaEmail) {
      throw new Error(
        'Token non valido o scaduto'
      );
    }

    const contoCorrente =
      await ContoCorrenteModel.findOne({
        contoCorrenteId:
          verificaEmail.contoCorrenteId,
      });

    if (!contoCorrente) {
      throw new Error(
        'Conto corrente non trovato'
      );
    }

    if (contoCorrente.isVerified) {
      await VerificaEmailModel.deleteOne({
        _id: verificaEmail._id,
      });

      return 'Email già verificata';
    }

    const categoria =
      await CategoriaMovimentoModel.findOne({
        nomeCategoria :  "apertura_conto",
        tipologia: 'Entrata'
      });

    if (!categoria) {
      throw new Error(
        'Categoria apertura conto non trovata'
      );
    }

    contoCorrente.isVerified = true;
    await contoCorrente.save();

    await MovimentoContoCorrenteModel.create({
      ContoCorrenteID:
        contoCorrente.contoCorrenteId,
      Importo: 0,
      Saldo: 0,
      CategoriaMovimentoID:
        categoria.categoriaMovimentoId,
      DescrizioneEstesa:
        'Apertura conto: saldo iniziale 0€',
    });

    await VerificaEmailModel.deleteOne({
      _id: verificaEmail._id,
    });

    return 'Email verificata e movimento iniziale creato con successo';
  }
}


export default new VerificaEmailService();