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

  public readonly findByUsername = async (
    username: string
  ): Promise<User | null> => {
    const user = await UserModel.findOne({ username }).lean();
    if (!user) {
      return null;
    }
    return parseDbResponseOrThrow<User>(userSchema, user);
  };
}
