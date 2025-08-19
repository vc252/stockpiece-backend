import { Request, Response, NextFunction } from "express";
import { getApiError } from "../common/HttpResponse.js";
import { GetStocksQuery } from "../types/stockTypes.js";
import { roles } from "../common/constants.js";
import { logger } from "../utils/logger.js";

export const restrictStocksByRole = (
  req: Request<object, object, object, unknown>,
  _res: Response,
  next: NextFunction
): void => {
  const role = req.payload?.role;
  const query = req.validatedQuery as GetStocksQuery;
  const isActiveParam = query.isActive;

  logger.debug(`${role} ${isActiveParam}`);

  switch (role) {
    case roles.ADMIN:
      // Admins can access all stocks - no restrictions
      break;

    case roles.USER:
      if (isActiveParam === false) {
        throw getApiError("FORBIDDEN");
      }

      // If no filter specified, default to active stocks
      if (isActiveParam === undefined || isActiveParam === null) {
        query.isActive = true;
      }
      break;

    default:
      throw getApiError(
        "FORBIDDEN",
        undefined,
        "Invalid role or access denied"
      );
  }

  next();
};
