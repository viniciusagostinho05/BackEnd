import { UserExistsError } from "../../errors/user-exist.error";
import { ContoCorrenteDto } from "../auth/auth.dto";
import { ContoCorrente } from "./registrazione.entity";
import { contoCorrenteModel } from "./registrazione.model";
import * as bcrypt from 'bcrypt';


export class UserService {
  async add(  contoCorrente: ContoCorrenteDto, credentials: { email: string; password: string; }
  ): Promise<ContoCorrente> {
    const existingIdentity =
      await contoCorrenteModel.findOne({
        'credentials.email': credentials.email
      });

    if (existingIdentity) {
      throw new UserExistsError();
    }

     const hashedPassword = await bcrypt.hash(
      credentials.password,
      10
    );

    contoCorrente.password = hashedPassword;
    const newUser = await contoCorrenteModel.create(contoCorrente);

    return newUser.toObject();
  }
}

export default new UserService();