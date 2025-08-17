import { roles } from "../common/constants.common.js";
import { getApiError } from "../common/HttpResponse.js";
import { mapUserToUserResponse } from "../common/mappings.common.js";
import { UserAuthResponse, UserJwtPayload } from "../common/types.common.js";
import env from "../config/env.config.js";
import Container from "../container/Container.js";
import UserRepository from "../repositories/user.repositories.js";
import {
  CreateUserRequest,
  AuthRequest,
  User,
  UserResponse,
  UpdateAvatarResponse,
} from "../schemas/User.schema.js";
import { logger } from "../utils/logger.js";
import * as argon from "argon2";
import jwt from "jsonwebtoken";
import { StringValue } from "ms";
import FileUploadService from "./FileUploaderService.js";
import { ApiError } from "../common/ApiError.js";

export default class UserService {
  private readonly userRepository: UserRepository;
  private readonly fileUploadService: FileUploadService;

  constructor(Container: Container) {
    this.userRepository = Container.resolve<UserRepository>("UserRepository");
    this.fileUploadService =
      Container.resolve<FileUploadService>("FileUploadService");
  }

  public readonly registerUser = async (
    user: CreateUserRequest
  ): Promise<UserResponse> => {
    const createdUser: User = await this.userRepository.createUser(user);
    const userResponse: UserResponse = mapUserToUserResponse(createdUser);

    logger.info(`user created:`, userResponse);

    return userResponse;
  };

  //we can login either via mail or username
  public readonly loginUser = async (
    loginRequest: AuthRequest
  ): Promise<UserAuthResponse> => {
    //first we need to find the user and then verify its password
    let user;
    if (loginRequest.identifier.includes("@")) {
      //then it might be an email
      user = await this.userRepository.findByEmail(loginRequest.identifier);
    } else {
      user = await this.userRepository.findByUsername(loginRequest.identifier);
    }

    if (!user) {
      throw getApiError("INVALID_CREDENTIALS");
    }

    if (!(await argon.verify(user.password, loginRequest.password))) {
      throw getApiError("INVALID_CREDENTIALS");
    }

    return this.getAccessRefreshToken(user);
  };

  private readonly getAccessRefreshToken = (user: User): UserAuthResponse => {
    const payload: UserJwtPayload = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      role: roles.USER,
    };

    const accessToken = jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
      expiresIn: env.USER_ACCESS_TOKEN_EXPIRY as StringValue,
    });

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

  public readonly updateAvatar = async (
    userId: string,
    avatarFilePath: string
  ): Promise<UpdateAvatarResponse> => {
    try {
      // Get user to check if they have an existing avatar
      const existingUser = await this.userRepository.findById(userId);
      if (!existingUser) {
        throw getApiError("USER_NOT_FOUND");
      }

      // Upload new avatar to Cloudinary
      const newAvatarUrl = await this.fileUploadService.uploadOnCloudinary(
        avatarFilePath,
        {
          folder: "user-avatars",
          processImage: true,
          width: 300,
          height: 300,
          quality: 80,
          displayName: `${existingUser.username}-avatar`,
        }
      );

      // Only delete from Cloudinary if it's NOT the default avatar
      if (
        existingUser.avatar &&
        existingUser.avatar !== this.fileUploadService.getDefaultAvatarUrl()
      ) {
        try {
          await this.fileUploadService.deleteFromCloudinary(
            existingUser.avatar,
            true
          );
        } catch (error) {
          // Log but don't fail the update if old avatar deletion fails
          logger.warn("Failed to delete old avatar:", error);
        }
      }

      // Update user avatar
      const updatedUser = await this.userRepository.updateById(userId, {
        avatar: newAvatarUrl,
      });

      if (!updatedUser) {
        throw getApiError("USER_NOT_FOUND");
      }

      return {
        _id: updatedUser._id.toString(),
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar!,
        updatedAt: updatedUser.updatedAt,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw getApiError("INTERNAL_SERVER_ERROR", error);
    }
  };
}
