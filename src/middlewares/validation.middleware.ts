import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { parseRequestOrThrow } from "../utils/parseOrThrow.util.js";

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
      req.query = parseRequestOrThrow<unknown>(schema, req.query, "query");
    } catch (err) {
      next(err);
    }
  };

const validateRequestRouteParams =
  (schema: ZodSchema<unknown>) =>
  (req: Request<unknown, object, object>, _: Response, next: NextFunction) => {
    try {
      req.params = parseRequestOrThrow<unknown>(schema, req.params, "params");
    } catch (err) {
      next(err);
    }
  };

export {
  validateRequestBody,
  validateRequestQueryParams,
  validateRequestRouteParams,
};
