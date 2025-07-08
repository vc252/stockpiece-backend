import { ApiError } from "../common/ApiError.js";
import { getApiError } from "../common/HttpResponse.js";
import { mapUserToUserResponse } from "../common/mappings.common.js";
import { AuthResponse } from "../common/types.common.js";
import env from "../config/env.config.js";
import Container from "../container/Container.js";
import UserRepository from "../repositories/user.repositories.js";
import {
  CreateUserRequest,
  AuthRequest,
  User,
  UserResponse,
} from "../schemas/User.schema.js";
import { logger } from "../utils/logger.js";
import * as argon from "argon2";
import jwt from "jsonwebtoken";
import { StringValue } from "ms";

export default class UserService {
  private readonly userRepository: UserRepository;

  constructor(Container: Container) {
    this.userRepository = Container.resolve<UserRepository>("userRepository");
  }

  public readonly registerUser = async (
    user: CreateUserRequest
  ): Promise<UserResponse> => {
    const createdUser: User = await this.userRepository.createUser(user);
    const userResponse: UserResponse = mapUserToUserResponse(createdUser);
    logger.info(`user created:`, userResponse);
    return userResponse;
  };

  public readonly loginUser = async (
    loginRequest: AuthRequest
  ): Promise<AuthResponse> => {
    //first we need to find the user and then verify its password
    const user: User = await this.verifiedUser(loginRequest);
    return this.getAccessRefreshToken(user);
  };

  private readonly verifiedUser = async (
    loginRequest: AuthRequest
  ): Promise<User> => {
    const user: User = await this.userRepository.findByUsername(
      loginRequest.username
    );

    if (!(await argon.verify(user.password, loginRequest.password))) {
      throw getApiError("INVALID_CREDENTIALS");
    }

    return user;
  };

  private readonly getAccessRefreshToken = (
    user: User
  ): { accessToken: string; refreshToken: string } => {
    const accessToken = jwt.sign(
      {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
      env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: env.ACCESS_TOKEN_EXPIRY as StringValue,
      }
    );

    const refreshToken = jwt.sign(
      {
        _id: user._id,
      },
      env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: env.REFRESH_TOKEN_EXPIRY as StringValue,
      }
    );

    return { accessToken, refreshToken };
  };
}
