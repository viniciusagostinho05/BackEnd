import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import * as bcrypt from "bcrypt";
import { ContoCorrenteModel } from "../../../conto-corrente/conto-corrente.model";

passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async function (email, password, done) {
      try {

        const conto = await ContoCorrenteModel.findOne({
          email: email
        });

        if (!conto) {
          return done(null, false, {
            message: "Email non trovata"
          });
        }

        const match = await bcrypt.compare(
          password,
          conto.password
        );

        if (!match) {
          return done(null, false, {
            message: "Password non corretta"
          });
        }

        done(null, conto);

      } catch (err) {
        done(err);
      }
    }
  )
);