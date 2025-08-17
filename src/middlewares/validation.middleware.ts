import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { parseRequestOrThrow } from "../utils/parseOrThrow.util.js";
import { logger } from "../utils/logger.js";

const validate =
  (schema: ZodSchema<unknown>) =>
  (req: Request<object, object, unknown>, _: Response, next: NextFunction) => {
    try {
      //req.body is still parse as any
      req.body = parseRequestOrThrow<unknown>(schema, req.body);
      next();
    } catch (err) {
      logger.debug("validation error: ", err);
      next(err);
    }
  };

export default validate;
