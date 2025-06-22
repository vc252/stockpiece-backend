import UserModel from "../models/user.model.js";
import {
  CreateUserInput,
  UserResponse,
  userResponseSchema,
} from "../schemas/User.schema.js";
import { parseOrThrow } from "../utils/parseOrThrow.util.js";

export default class UserRepository {
  public readonly createUser = async (
    user: CreateUserInput
  ): Promise<UserResponse> => {
    const createdUser = await UserModel.create(user);
    return parseOrThrow<UserResponse>(
      userResponseSchema,
      createdUser.toObject()
    );
  };
}
