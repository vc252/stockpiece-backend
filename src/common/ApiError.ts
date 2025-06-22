import { HttpError } from "./HttpResponse.js";

export class ApiError extends Error {
  public readonly success = false;

  constructor(
    public readonly statusCode: number = HttpError.INTERNAL_SERVER_ERROR
      .statusCode,
    public readonly name: string = HttpError.INTERNAL_SERVER_ERROR.error,
    public readonly message: string = HttpError.INTERNAL_SERVER_ERROR.message,
    public readonly rawError?: object
  ) {
    super(message);

    if (!this.stack) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
