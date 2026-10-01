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

      
   await transporter.sendMail({
  from: `"Banca delle Canarie" <${process.env.SMTP_FROM}>`,
  to: email,
  subject: "Conferma il tuo indirizzo email",

  text: `
Ciao!

Grazie per esserti registrato alla Banca delle Canarie.

Per attivare il tuo account, apri il seguente link:

${verificationUrl}

Il link scadrà tra 24 ore.

Se non hai creato tu questo account, puoi ignorare questa email.

A presto,
Il team di La mia applicazione
  `.trim(),

  html: `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Conferma il tuo indirizzo email</title>
</head>

<body style="
  margin: 0;
  padding: 0;
  background-color: #f1f5f9;
  font-family: Arial, Helvetica, sans-serif;
  color: #1e293b;
">

  <table
    role="presentation"
    width="100%"
    cellspacing="0"
    cellpadding="0"
    border="0"
    style="background-color: #f1f5f9; padding: 40px 16px;"
  >
    <tr>
      <td align="center">

        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="
            max-width: 560px;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
          "
        >

          <!-- Header -->
          <tr>
            <td
              align="center"
              style="
                background: linear-gradient(135deg, #2563eb, #1d4ed8);
                padding: 32px 24px;
              "
            >
              <div style="
                display: inline-block;
                width: 56px;
                height: 56px;
                line-height: 56px;
                border-radius: 50%;
                background-color: rgba(255,255,255,0.18);
                color: #ffffff;
                font-size: 28px;
                font-weight: bold;
              ">
                ✓
              </div>

              <h1 style="
                margin: 18px 0 0;
                color: #ffffff;
                font-size: 26px;
                line-height: 1.3;
              ">
                Verifica il tuo account
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 36px 32px 24px;">
              <p style="
                margin: 0 0 18px;
                font-size: 17px;
                line-height: 1.6;
              ">
                Ciao!
              </p>

              <p style="
                margin: 0 0 18px;
                font-size: 16px;
                line-height: 1.6;
                color: #475569;
              ">
                Grazie per esserti registrato a
                <strong style="color: #2563eb;">
                  La mia applicazione
                </strong>.
              </p>

              <p style="
                margin: 0 0 28px;
                font-size: 16px;
                line-height: 1.6;
                color: #475569;
              ">
                Per completare la registrazione e attivare il tuo account,
                clicca sul pulsante qui sotto.
              </p>

              <!-- Button -->
              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
              >
                <tr>
                  <td align="center">
                    <a
                      href="${verificationUrl}"
                      style="
                        display: inline-block;
                        padding: 14px 28px;
                        background-color: #2563eb;
                        color: #ffffff;
                        text-decoration: none;
                        font-size: 16px;
                        font-weight: bold;
                        border-radius: 8px;
                      "
                    >
                      Verifica il mio indirizzo email
                    </a>
                  </td>
                </tr>
              </table>

              <p style="
                margin: 28px 0 0;
                font-size: 14px;
                line-height: 1.6;
                color: #64748b;
                text-align: center;
              ">
                Il link di verifica scadrà tra
                <strong>24 ore</strong>.
              </p>
            </td>
          </tr>

          <!-- Fallback link -->
          <tr>
            <td style="
              padding: 0 32px 30px;
            ">
              <div style="
                padding: 16px;
                background-color: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
              ">
                <p style="
                  margin: 0 0 8px;
                  font-size: 13px;
                  color: #64748b;
                ">
                  Se il pulsante non funziona, copia e incolla questo link
                  nel browser:
                </p>

                <a
                  href="${verificationUrl}"
                  style="
                    font-size: 12px;
                    line-height: 1.5;
                    color: #2563eb;
                    word-break: break-all;
                  "
                >
                  ${verificationUrl}
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="
              padding: 22px 32px;
              background-color: #f8fafc;
              border-top: 1px solid #e2e8f0;
              text-align: center;
            ">
              <p style="
                margin: 0 0 8px;
                font-size: 13px;
                color: #64748b;
              ">
                Se non hai creato tu questo account, puoi ignorare
                questa email.
              </p>

              <p style="
                margin: 0;
                font-size: 13px;
                color: #94a3b8;
              ">
                A presto,<br>
                <strong>Il team di La mia applicazione</strong>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `.trim(),
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