import { UserJwtPayload, AdminJwtPayload } from "../common/types.common.js";

declare global {
  namespace Express {
    interface Request {
      payload?: UserJwtPayload | AdminJwtPayload;
      user?: UserJwtPayload | AdminJwtPayload;
    }
  }
}

export {};
