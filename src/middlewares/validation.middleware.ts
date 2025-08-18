import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { parseRequestOrThrow } from "../utils/parseOrThrow.util.js";
import { GetStocksQuery } from "../schemas/stockSchema.js";

const validateRequestBody =
  (schema: ZodSchema<unknown>) =>
  (req: Request<object, object, unknown>, _: Response, next: NextFunction) => {
    try {
      //req.body is still parse as any
      req.body = parseRequestOrThrow<unknown>(schema, req.body, "body");
      next();
    } catch (err) {
      next(err);
    }
  };

const validateRequestQueryParams =
  (schema: ZodSchema<unknown>) =>
  (
    req: Request<object, object, object, unknown>,
    _: Response,
    next: NextFunction
  ) => {
    try {
      req.validatedQuery = parseRequestOrThrow<GetStocksQuery>(
        schema,
        req.query,
        "query"
      );
      next();
    } catch (err) {
      next(err);
    }
  };

const validateRequestRouteParams =
  (schema: ZodSchema<unknown>) =>
  (req: Request<unknown, object, object>, _: Response, next: NextFunction) => {
    try {
      req.params = parseRequestOrThrow<unknown>(schema, req.params, "params");
      next();
    } catch (err) {
      next(err);
    }
  };

export {
  validateRequestBody,
  validateRequestQueryParams,
  validateRequestRouteParams,
};
