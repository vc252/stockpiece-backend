import { Request, Response, NextFunction } from "express";
import { ApiError } from "../common/ApiError.js";
import { HttpError, getApiError } from "../common/HttpResponse.js";
import { ApiResponse } from "../common/ApiResponse.js";
import { logger } from "../utils/logger.js";
import multer from "multer";

export const errorHandler = (
  error: Error | ApiError,
  req: Request,
  res: Response,
  _: NextFunction
): void => {
  const isDev = process.env.NODE_ENV === "development";

  // Handle Multer errors and convert to ApiError
  if (error instanceof multer.MulterError) {
    error = handleMulterError(error);
  }

  // Default to 500
  let statusCode: number = HttpError.INTERNAL_SERVER_ERROR.statusCode;
  let message: string = HttpError.INTERNAL_SERVER_ERROR.message;
  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  const logData = {
    name: error.name,
    message: error.message,
    statusCode,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    userAgent: req.get("User-Agent"),
    ip: req.ip, // rely on Express proxy settings
    rawError: error instanceof ApiError ? error.rawError : undefined,
  };

  if (isDev) {
    logger.error("Dev Error:", logData);
  } else {
    const isServerError = statusCode >= 500;
    const isUnexpected = !(error instanceof ApiError);

    if (isUnexpected || isServerError) {
      // map to actual logger levels your lib supports
      const level = isServerError ? "error" : "warn";
      const prodLogData = {
        ...logData,
        stack: isServerError ? error.stack : undefined,
        rawError: undefined,
      };
      logger[level]("Prod Error:", prodLogData);
    }
  }

  // Create error response with raw error data in development
  const errorData = isDev && error instanceof ApiError ? error.rawError : null;
  const errorResponse = new ApiResponse(
    statusCode,
    isDev || statusCode < 500 ? message : "Internal Server Error",
    errorData
  );

  res.status(statusCode).json(errorResponse);
};

// Helper function to convert Multer errors to ApiError
const handleMulterError = (error: multer.MulterError): ApiError => {
  switch (error.code) {
    case "LIMIT_FILE_SIZE":
      return getApiError("BAD_REQUEST", "File size exceeds limit");
    case "LIMIT_FILE_COUNT":
      return getApiError("BAD_REQUEST", "Maximum number of files exceeded");
    case "LIMIT_UNEXPECTED_FILE":
      return getApiError("BAD_REQUEST", "Unexpected file field");
    case "LIMIT_PART_COUNT":
      return getApiError("BAD_REQUEST", "Too many parts in multipart data");
    case "LIMIT_FIELD_KEY":
      return getApiError("BAD_REQUEST", "Field name too long");
    case "LIMIT_FIELD_VALUE":
      return getApiError("BAD_REQUEST", "Field value too long");
    case "LIMIT_FIELD_COUNT":
      return getApiError("BAD_REQUEST", "Too many fields");
    default:
      return getApiError("BAD_REQUEST", `Upload error: ${error.message}`);
  }
};
