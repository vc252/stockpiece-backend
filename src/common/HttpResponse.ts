import { ApiError } from "./ApiError.js";

const HttpError = {
  BAD_REQUEST: {
    statusCode: 400,
    name: "BadRequest",
    message: "The request is invalid or malformed",
  },
  VALIDATION_ERROR: {
    statusCode: 400,
    name: "BadRequest",
    message: "Invalid request body",
  },
  INVALID_CLOUDINARY_URL: {
    statusCode: 400,
    name: "BadRequest",
    message: "Invalid Cloudinary URL provided",
  },
  UNAUTHORIZED: {
    statusCode: 401,
    name: "Unauthorized",
    message: "Authentication is required or failed",
  },
  ACCESS_TOKEN_MISSING: {
    statusCode: 401,
    name: "Unauthorized",
    message: "Access token is required but not provided",
  },
  INVALID_ACCESS_TOKEN: {
    statusCode: 401,
    name: "Unauthorized",
    message: "Access token is invalid or expired",
  },
  PASSWORD_INCORRECT: {
    statusCode: 401,
    name: "Unauthorized",
    message: "Password is incorrect",
  },
  INVALID_CREDENTIALS: {
    statusCode: 401,
    name: "Unauthorized",
    message: "Invalid username or password",
  },
  FORBIDDEN: {
    statusCode: 403,
    name: "Forbidden",
    message: "You do not have permission to access this resource",
  },
  NOT_FOUND: {
    statusCode: 404,
    name: "NotFound",
    message: "The requested resource was not found",
  },
  USER_NOT_FOUND: {
    statusCode: 404,
    name: "NotFound",
    message: "User not found",
  },
  METHOD_NOT_ALLOWED: {
    statusCode: 405,
    name: "MethodNotAllowed",
    message: "The HTTP method is not allowed for this endpoint",
  },
  CONFLICT: {
    statusCode: 409,
    name: "Conflict",
    message: "Request conflicts with the current state of the resource",
  },
  UNSUPPORTED_MEDIA_TYPE: {
    statusCode: 415,
    name: "UnsupportedMediaType",
    message: "The media type of the request is not supported",
  },
  TOO_MANY_REQUESTS: {
    statusCode: 429,
    name: "TooManyRequests",
    message: "Too many requests have been sent in a given amount of time",
  },
  INTERNAL_SERVER_ERROR: {
    statusCode: 500,
    name: "InternalServerError",
    message: "An unexpected error occurred on the server",
  },
  CLOUDINARY_UPLOAD_FAILED: {
    statusCode: 500,
    name: "InternalServerError",
    message: "Failed to upload file to Cloudinary",
  },
  CLOUDINARY_DESTROY_FAILED: {
    statusCode: 500,
    name: "InternalServerError",
    message: "Failed to delete from Cloudinary",
  },
  SERVICE_UNAVAILABLE: {
    statusCode: 503,
    name: "ServiceUnavailable",
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
  ADMIN_CREATED: {
    statusCode: 201,
    message: "Admin created successfully",
  },
  LOGGED_IN: {
    statusCode: 200,
    message: "logged in successfully",
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
    HttpError[errorType].name,
    HttpError[errorType].message,
    rawError
  );
}

export { HttpError, HttpSuccess, getApiError };
