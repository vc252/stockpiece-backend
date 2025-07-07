import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { parseRequestOrThrow } from "../utils/parseOrThrow.util.js";

const validate =
  (schema: ZodSchema<unknown>) =>
  (req: Request, _: Response, next: NextFunction) => {
    try {
      //req.body is still parse as any
      req.body = parseRequestOrThrow<unknown>(schema, req.body);
      next();
    } catch (err) {
      next(err);
    }
  };

export default validate;
