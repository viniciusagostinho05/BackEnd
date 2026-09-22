import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { ContoCorrenteModel } from '../../../conto-corrente/conto-corrente.model';

passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },

    async (email, password, done) => {
      try {
        const contoCorrente =
          await ContoCorrenteModel.findOne({
            email: email.toLowerCase().trim(),
          }).select('+password');

        if (!contoCorrente) {
          return done(null, false, {
            message: 'Email o password non validi',
          });
        }

        const passwordCorretta =
          await bcrypt.compare(
            password,
            contoCorrente.password
          );

        if (!passwordCorretta) {
          return done(null, false, {
            message: 'Email o password non validi',
          });
        }

        if (!contoCorrente.isVerified) {
          return done(null, false, {
            message:
              'Devi verificare la tua email prima di accedere',
          });
        }

        return done(null, contoCorrente);
      } catch (error) {
        return done(error);
      }
    }
  )
);