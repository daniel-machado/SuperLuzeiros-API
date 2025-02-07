import { UserAttributes } from "../../src/infrastructure/database/models/User";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserAttributes;
  }
}