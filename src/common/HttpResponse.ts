import { ApiError } from "./ApiError.js";

const HttpError = {
  BAD_REQUEST: {
    statusCode: 400,
    error: "BadRequest",
    message: "The request is invalid or malformed",
  },
  VALIDATION_ERROR: {
    statusCode: 400,
    error: "ValidationError",
    message: "Invalid request body",
  },
  UNAUTHORIZED: {
    statusCode: 401,
    error: "Unauthorized",
    message: "Authentication is required or failed",
  },
  FORBIDDEN: {
    statusCode: 403,
    error: "Forbidden",
    message: "You do not have permission to access this resource",
  },
  NOT_FOUND: {
    statusCode: 404,
    error: "NotFound",
    message: "The requested resource was not found",
  },
  USER_NOT_FOUND: {
    statusCode: 404,
    error: "UserNotFound",
    message: "User not found",
  },
  INVALID_CREDENTIALS: {
    statusCode: 401,
    error: "InvalidCredentials",
    message: "Invalid username or password",
  },
  METHOD_NOT_ALLOWED: {
    statusCode: 405,
    error: "MethodNotAllowed",
    message: "The HTTP method is not allowed for this endpoint",
  },
  CONFLICT: {
    statusCode: 409,
    error: "Conflict",
    message: "Request conflicts with the current state of the resource",
  },
  UNSUPPORTED_MEDIA_TYPE: {
    statusCode: 415,
    error: "UnsupportedMediaType",
    message: "The media type of the request is not supported",
  },
  UNPROCESSABLE_ENTITY: {
    statusCode: 422,
    error: "UnprocessableEntity",
    message: "The request was well-formed but contains semantic errors",
  },
  TOO_MANY_REQUESTS: {
    statusCode: 429,
    error: "TooManyRequests",
    message: "Too many requests have been sent in a given amount of time",
  },
  INTERNAL_SERVER_ERROR: {
    statusCode: 500,
    error: "InternalServerError",
    message: "An unexpected error occurred on the server",
  },
  SERVICE_UNAVAILABLE: {
    statusCode: 503,
    error: "ServiceUnavailable",
    message: "The service is temporarily unavailable",
  },
} as const;

const HttpSuccess = {
  OK: {
    statusCode: 200,
    message: "Request succeeded",
  },
  CREATED: {
    statusCode: 201,
    message: "Resource successfully created",
  },
  USER_REGISTERED: {
    statusCode: 201,
    message: "User registered successfully",
  },
  USER_LOGGED_IN: {
    statusCode: 200,
    message: "User logged in successfully",
  },
  ACCEPTED: {
    statusCode: 202,
    message: "Request accepted for processing",
  },
  NO_CONTENT: {
    statusCode: 204,
    message: "No content to return",
  },
} as const;

function getApiError(
  errorType: keyof typeof HttpError,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawError?: any
): ApiError {
  return new ApiError(
    HttpError[errorType].statusCode,
    HttpError[errorType].error,
    HttpError[errorType].message,
    rawError
  );
}

export { HttpError, HttpSuccess, getApiError };
