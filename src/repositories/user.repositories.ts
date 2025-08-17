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

  public readonly findByEmail = async (email: string): Promise<User | null> => {
    const user = await UserModel.findOne({ email }).lean();

    if (!user) {
      return null;
    }

    return parseDbResponseOrThrow<User>(userSchema, user);
  };

  public readonly findById = async (_id: string): Promise<User | null> => {
    const user = await UserModel.findById(_id);
    if (!user) {
      return null;
    }
    return parseDbResponseOrThrow<User>(userSchema, user);
  };

  public readonly updateById = async (
    _id: string,
    updateBody: Partial<User>
  ): Promise<User | null> => {
    const user = await UserModel.findByIdAndUpdate(
      _id,
      {
        $set: updateBody,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!user) {
      return null;
    }
    return parseDbResponseOrThrow<User>(userSchema, user);
  };
}
