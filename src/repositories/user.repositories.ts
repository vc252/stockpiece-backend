import { ApiError } from "../common/ApiError.js";
import { HttpError } from "../common/HttpResponse.js";
import UserModel from "../models/user.model.js";
import { CreateUserRequest, User, userSchema } from "../schemas/User.schema.js";
import { parseDbResponseOrThrow } from "../utils/parseOrThrow.util.js";

export default class UserRepository {
  public readonly createUser = async (
    user: CreateUserRequest
  ): Promise<User> => {
    const createdUser = await UserModel.create(user);
    return parseDbResponseOrThrow<User>(userSchema, createdUser.toObject());
  };

  public readonly findByUsername = async (username: string): Promise<User> => {
    const user = await UserModel.findOne({ username }).lean();
    if (!user) {
      throw new ApiError(
        HttpError.USER_NOT_FOUND.statusCode,
        HttpError.USER_NOT_FOUND.error,
        HttpError.USER_NOT_FOUND.message
      );
    }
    return parseDbResponseOrThrow<User>(userSchema, user);
  };
}
