import { IUserAttributes } from "../../src/infrastructure/database/models/User";

import { Express } from "express-serve-static-core";

declare global {
  namespace Express {
    interface Request {
      user?: IUserAttributes;
    }
  }
}



// declare module "express-serve-static-core" {
//   interface Request {
//     user?: UserAttributes;
//   }
// }