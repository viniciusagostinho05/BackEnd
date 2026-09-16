import mongoose from "mongoose";
import ContoCorrente from "./models/ContoCorrente";
import MovimentoContoCorrente from "./models/MovimentiContoCorrente";
import CategoriaMovimento from "./models/CategoriaMovimento";

mongoose.connect("mongodb://localhost:27017/gestione-conti")
    .then(async () => {

        console.log("MongoDB connesso!");

      
        await ContoCorrente.deleteMany({});
        await MovimentoContoCorrente.deleteMany({});
        await CategoriaMovimento.deleteMany({});

       
        const categorie = await CategoriaMovimento.insertMany([
            {
                CategoriaMovimentoID: 1,
                NomeCategoria: "Apertura Conto",
                Tipologia: "Entrata"
            },
            {
                CategoriaMovimentoID: 2,
                NomeCategoria: "Bonifico Entrata",
                Tipologia: "Entrata"
            },
            {
                CategoriaMovimentoID: 3,
                NomeCategoria: "Bonifico Uscita",
                Tipologia: "Uscita"
            },
            {
                CategoriaMovimentoID: 4,
                NomeCategoria: "Prelievo contanti",
                Tipologia: "Uscita"
            },
            {
                CategoriaMovimentoID: 5,
                NomeCategoria: "Pagamento Utenze",
                Tipologia: "Uscita"
            },
            {
                CategoriaMovimentoID: 6,
                NomeCategoria: "Ricarica",
                Tipologia: "Entrata"
            },
            {
                CategoriaMovimentoID: 7,
                NomeCategoria: "Versamento Bancomat",
                Tipologia: "Entrata"
            }
        ]);

        console.log("Categorie inserite:", categorie.length);

       
        const conti = await ContoCorrente.insertMany([
            {
                ContoCorrenteID: 1,
                Email: "mario.rossi@email.it",
                Password: "password123",
                CognomeTitolare: "Rossi",
                NomeTitolare: "Mario",
                DataApertura: new Date("2025-01-15"),
                IBAN: "IT60X0542811101000000123456"
            },
            {
                ContoCorrenteID: 2,
                Email: "luca.bianchi@email.it",
                Password: "password456",
                CognomeTitolare: "Bianchi",
                NomeTitolare: "Luca",
                DataApertura: new Date("2025-03-20"),
                IBAN: "IT60X0542811101000000654321"
            },
            {
                ContoCorrenteID: 3,
                Email: "anna.verdi@email.it",
                Password: "password789",
                CognomeTitolare: "Verdi",
                NomeTitolare: "Anna",
                DataApertura: new Date("2025-06-10"),
                IBAN: "IT60X0542811101000000987654"
            }
        ]);

        console.log("Conti inseriti:", conti.length);

       
        const movimenti = await MovimentoContoCorrente.insertMany([

            // Mario Rossi
            {
                MovimentoID: 1,
                ContoCorrenteID: 1,
                Data: new Date("2025-01-15"),
                Importo: 1000,
                Saldo: 1000,
                CategoriaMovimentoID: 1,
                DescrizioneEstesa: "Apertura del conto corrente"
            },
            {
                MovimentoID: 2,
                ContoCorrenteID: 1,
                Data: new Date("2025-01-20"),
                Importo: 1500,
                Saldo: 2500,
                CategoriaMovimentoID: 2,
                DescrizioneEstesa: "Stipendio mensile"
            },
            {
                MovimentoID: 3,
                ContoCorrenteID: 1,
                Data: new Date("2025-01-25"),
                Importo: -300,
                Saldo: 2200,
                CategoriaMovimentoID: 3,
                DescrizioneEstesa: "Bonifico per acquisto computer"
            },
            {
                MovimentoID: 4,
                ContoCorrenteID: 1,
                Data: new Date("2025-02-01"),
                Importo: -100,
                Saldo: 2100,
                CategoriaMovimentoID: 4,
                DescrizioneEstesa: "Prelievo contanti"
            },

            // Luca Bianchi
            {
                MovimentoID: 5,
                ContoCorrenteID: 2,
                Data: new Date("2025-03-20"),
                Importo: 2000,
                Saldo: 2000,
                CategoriaMovimentoID: 1,
                DescrizioneEstesa: "Apertura del conto corrente"
            },
            {
                MovimentoID: 6,
                ContoCorrenteID: 2,
                Data: new Date("2025-04-01"),
                Importo: 1200,
                Saldo: 3200,
                CategoriaMovimentoID: 2,
                DescrizioneEstesa: "Accredito stipendio"
            },
            {
                MovimentoID: 7,
                ContoCorrenteID: 2,
                Data: new Date("2025-04-05"),
                Importo: -150,
                Saldo: 3050,
                CategoriaMovimentoID: 5,
                DescrizioneEstesa: "Pagamento bolletta elettrica"
            },

            // Anna Verdi
            {
                MovimentoID: 8,
                ContoCorrenteID: 3,
                Data: new Date("2025-06-10"),
                Importo: 500,
                Saldo: 500,
                CategoriaMovimentoID: 1,
                DescrizioneEstesa: "Apertura del conto corrente"
            },
            {
                MovimentoID: 9,
                ContoCorrenteID: 3,
                Data: new Date("2025-06-15"),
                Importo: 200,
                Saldo: 700,
                CategoriaMovimentoID: 7,
                DescrizioneEstesa: "Versamento tramite bancomat"
            },
            {
                MovimentoID: 10,
                ContoCorrenteID: 3,
                Data: new Date("2025-06-20"),
                Importo: -50,
                Saldo: 650,
                CategoriaMovimentoID: 4,
                DescrizioneEstesa: "Prelievo contanti"
            },
            {
                MovimentoID: 11,
                ContoCorrenteID: 3,
                Data: new Date("2025-06-25"),
                Importo: 100,
                Saldo: 750,
                CategoriaMovimentoID: 6,
                DescrizioneEstesa: "Ricarica"
            }
        ]);

        console.log("Movimenti inseriti:", movimenti.length);

        console.log("Database popolato correttamente!");

        await mongoose.connection.close();
    })
    .catch((errore) => {
        console.error("Errore:", errore);
    });