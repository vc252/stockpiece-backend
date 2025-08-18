import { Request, Response, NextFunction } from "express";
import { getApiError } from "../common/HttpResponse.js";
import { GetStocksQuery } from "../schemas/stockSchema.js";
import { roles } from "../common/constants.common.js";
import { logger } from "../utils/logger.js";

export const restrictStocksByRole = (
  req: Request<object, object, object, unknown>,
  _res: Response,
  next: NextFunction
): void => {
  const role = req.payload?.role;
  const query = req.query as GetStocksQuery;
  const isActiveParam = query.isActive;

  switch (role) {
    case roles.ADMIN:
      // Admins can access all stocks - no restrictions
      break;

    case roles.USER:
      // Check if user is trying to access inactive stocks
      logger.debug(isActiveParam);
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
