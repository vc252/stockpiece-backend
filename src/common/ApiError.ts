import { HttpError } from "./HttpResponse.js";

export class ApiError extends Error {
  public readonly success = false;

  constructor(
    public readonly statusCode: number = HttpError.INTERNAL_SERVER_ERROR
      .statusCode,
    name: string = HttpError.INTERNAL_SERVER_ERROR.name,
    message: string = HttpError.INTERNAL_SERVER_ERROR.message,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public readonly rawError?: any
  ) {
    super(message);
    this.name = name;

    if (!this.stack) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
