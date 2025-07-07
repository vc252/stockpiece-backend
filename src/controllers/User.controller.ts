import { NextFunction, Request, Response } from "express";
import Container from "../container/Container.js";
import {
  CreateUserRequest,
  AuthRequest,
  UserResponse,
} from "../schemas/User.schema.js";
import UserService from "../services/User.service.js";
import { ApiResponse } from "../common/ApiResponse.js";
import { HttpSuccess } from "../common/HttpResponse.js";
import { AuthResponse } from "../common/types.common.js";
import { crossSiteSafeCookieOptions } from "../config/cookie.config.js";

export default class UserController {
  private readonly userService: UserService;
  constructor(container: Container) {
    this.userService = container.resolve<UserService>("userService");
  }

  public readonly registerUser = async (
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<void> => {
    const user: CreateUserRequest = req.body;
    const createdUser: UserResponse = await this.userService.registerUser(user);

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
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<void> => {
    const loginRequest: AuthRequest = req.body;
    const authResponse: AuthResponse =
      await this.userService.loginUser(loginRequest);

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
        new ApiResponse<AuthResponse>(
          HttpSuccess.USER_LOGGED_IN.statusCode,
          HttpSuccess.USER_LOGGED_IN.message,
          authResponse
        )
      );
  };
}
