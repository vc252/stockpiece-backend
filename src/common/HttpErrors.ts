const HttpError = {
  BAD_REQUEST: {
    statusCode: 400,
    error: "BadRequest",
    message: "The request is invalid or malformed",
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

export { HttpError };
