import { UserJwtPayload, AdminJwtPayload } from "./types/commonTypes.js";

declare global {
  namespace Express {
    interface Request {
      payload?: UserJwtPayload | AdminJwtPayload;
      validatedQuery?: unknown;
    }
  }
}

export {};
