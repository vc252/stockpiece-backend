import { ApiError } from "../common/ApiError.js";
import { HttpError } from "../common/HttpResponse.js";

const checkNull = (object: unknown) => {
  if (!object) {
    throw new ApiError(
      HttpError.INTERNAL_SERVER_ERROR.statusCode,
      HttpError.INTERNAL_SERVER_ERROR.name,
      HttpError.INTERNAL_SERVER_ERROR.message
    );
  }
};

export default checkNull;
