import { Request, Response, NextFunction } from "express";
import { getApiError } from "../common/HttpResponse.js";
import { GetStocksQuery } from "../schemas/stockSchema.js";

export const restrictStocksByRole = (
  req: Request<object, object, object, unknown>,
  _res: Response,
  next: NextFunction
): void => {
  const role = req.payload?.role;
  const query = req.query as GetStocksQuery;
  const isActiveParam = query.isActive;

  switch (role) {
    case "admin":
      // Admins can access all stocks - no restrictions
      break;

    case "user":
      // Check if user is trying to access inactive stocks
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
