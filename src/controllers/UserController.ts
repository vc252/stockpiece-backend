import { NextFunction, Request, Response } from "express";
import Container from "../container/Container.js";
import {
  CreateUserRequest,
  AuthRequest,
  UserResponse,
  UpdateAvatarResponse,
} from "../types/userTypes.js";
import UserService from "../services/User.service.js";
import { ApiResponse } from "../common/ApiResponse.js";
import { getApiError, HttpSuccess } from "../common/HttpResponse.js";
import { UserAuthResponse } from "../types/commonTypes.js";
import { crossSiteSafeCookieOptions } from "../config/cookie.config.js";
import { BaseController } from "./BaseController.js";

export default class UserController extends BaseController {
  private readonly userService: UserService;
  constructor(container: Container) {
    super(container);
    this.userService = this.resolve<UserService>("UserService");
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
    req: Request,
    res: Response<ApiResponse<UpdateAvatarResponse>>,
    _: NextFunction
  ): Promise<void> => {
    const userId = req.payload?._id;
    const avatarFile = req.file?.path;

    if (!userId) {
      throw getApiError("UNAUTHORIZED");
    }

    if (!avatarFile) {
      throw getApiError("BAD_REQUEST", "Avatar file is required");
    }

    const updatedUser = await this.userService.updateAvatar(userId, avatarFile);

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
