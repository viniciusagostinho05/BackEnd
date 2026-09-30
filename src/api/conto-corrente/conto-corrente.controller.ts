import { Request, Response, NextFunction } from "express";
import contoCorrenteService from "./conto-corrente.service";
import { TypedRequest } from "../utils/typed-request";

// export const home = async (
//   req: TypedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const contoCorrenteId = req.user?.contoCorrenteId

//     const home = await contoCorrenteService.getHome(contoCorrenteId!);

//     if (!home) {
//       res.status(404).json({
//         message: "Conto corrente non trovato."
//       });
//       return; 
//     }

//     res.json(home);
//   } catch (err) {
//     next(err);
//   }
// };

export const getUser = async (req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const contoCorrenteId = req.user?.contoCorrenteId;
        const user = await contoCorrenteService.findUser(contoCorrenteId!);
        res.json(user);
        return 
    }catch(err){
        next(err);
    }
}
