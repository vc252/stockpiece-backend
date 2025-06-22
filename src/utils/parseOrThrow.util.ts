import { ZodSchema } from "zod";
import { HttpError } from "../common/HttpResponse.js";
import { ApiError } from "../common/ApiError.js";
import { logger } from "./logger.js";

function parseOrThrow<T>(schema: ZodSchema, data: unknown): T {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    logger.verbose(
      JSON.stringify(
        new ApiError(
          HttpError.VALIDATION_ERROR.statusCode,
          HttpError.VALIDATION_ERROR.error,
          HttpError.VALIDATION_ERROR.message,
          parsed.error.format()
        )
      )
    );
    throw new ApiError(
      HttpError.VALIDATION_ERROR.statusCode,
      HttpError.VALIDATION_ERROR.error,
      HttpError.VALIDATION_ERROR.message,
      parsed.error.format()
    );
  }
  return parsed.data as T;
}

export { parseOrThrow };
