import { ContoCorrente as AppUser } from '../../registrazione/registrazione.entity';
import './local/local-strategy';
import './jwt/jwt-strategy';

declare global {
  namespace Express {
    interface User extends AppUser {

    }
  }
}