import { NextFunction, Request, Response } from "express";
import Container from "../container/Container.js";
import {
  CreateUserRequest,
  AuthRequest,
  UserResponse,
  UpdateAvatarResponse,
  UpdateAvatarRequest,
} from "../schemas/User.schema.js";
import UserService from "../services/User.service.js";
import { ApiResponse } from "../common/ApiResponse.js";
import { getApiError, HttpSuccess } from "../common/HttpResponse.js";
import { UserAuthResponse } from "../common/types.common.js";
import { crossSiteSafeCookieOptions } from "../config/cookie.config.js";

export default class UserController {
  private readonly userService: UserService;
  constructor(container: Container) {
    this.userService = container.resolve<UserService>("UserService");
  }

  public readonly registerUser = async (
    req: Request<object, object, CreateUserRequest>,
    res: Response<ApiResponse<UserResponse>>,
    _: NextFunction
  ): Promise<void> => {
    const user = req.body;
    const createdUser = await this.userService.registerUser(user);

    res
      .status(HttpSuccess.USER_REGISTERED.statusCode)
      .json(
        new ApiResponse<UserResponse>(
          HttpSuccess.USER_REGISTERED.statusCode,
          HttpSuccess.USER_REGISTERED.message,
          createdUser
        )
      );
  };

  public readonly loginUser = async (
    req: Request<object, object, AuthRequest>,
    res: Response<ApiResponse<UserAuthResponse>>,
    _: NextFunction
  ): Promise<void> => {
    const loginRequest = req.body;
    const authResponse = await this.userService.loginUser(loginRequest);

    res
      .status(200)
      .cookie(
        "accessToken",
        authResponse.accessToken,
        crossSiteSafeCookieOptions
      )
      .cookie(
        "refreshToken",
        authResponse.refreshToken,
        crossSiteSafeCookieOptions
      )
      .json(
        new ApiResponse<UserAuthResponse>(
          HttpSuccess.LOGGED_IN.statusCode,
          HttpSuccess.LOGGED_IN.message,
          authResponse
        )
      );
  };

  public readonly updateAvatar = async (
    req: Request<object, object, UpdateAvatarRequest>,
    res: Response<ApiResponse<UpdateAvatarResponse>>,
    _: NextFunction
  ): Promise<void> => {
    const updateRequest = req.body;
    const userId = req.payload?._id;

    if (!userId) {
      throw getApiError("UNAUTHORIZED");
    }

    const updatedUser = await this.userService.updateAvatar(
      userId,
      updateRequest
    );

    res
      .status(HttpSuccess.OK.statusCode)
      .json(
        new ApiResponse<UpdateAvatarResponse>(
          HttpSuccess.OK.statusCode,
          "Avatar updated successfully",
          updatedUser
        )
      );
  };
}
