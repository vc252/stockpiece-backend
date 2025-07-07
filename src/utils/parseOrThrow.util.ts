import { ZodSchema } from "zod";
import { HttpError } from "../common/HttpResponse.js";
import { ApiError } from "../common/ApiError.js";
import { logger } from "./logger.js";

function parseRequestOrThrow<T>(schema: ZodSchema, data: unknown): T {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new ApiError(
      HttpError.VALIDATION_ERROR.statusCode,
      HttpError.VALIDATION_ERROR.error,
      "Invalid request body",
      parsed.error.format()
    );
  }
  return parsed.data as T;
}

function parseDbResponseOrThrow<T>(schema: ZodSchema, data: unknown): T {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    logger.error("Invalid data from database", ...parsed.error.errors);
    throw new ApiError(
      HttpError.INTERNAL_SERVER_ERROR.statusCode,
      HttpError.INTERNAL_SERVER_ERROR.error,
      "Invalid data from database",
      parsed.error.format()
    );
  }
  return parsed.data as T;
}

export { parseRequestOrThrow, parseDbResponseOrThrow };
