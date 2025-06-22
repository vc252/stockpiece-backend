import { NextFunction, Request, Response } from "express";
import Container from "../container/Container.js";
import { CreateUserInput, UserResponse } from "../schemas/User.schema.js";
import UserService from "../services/User.service.js";
import { ApiError } from "../common/ApiError.js";
import checkNull from "../utils/checkNull.utils.js";
import { logger } from "../utils/logger.js";
import { ApiResponse } from "../common/ApiResponse.js";
import { HttpSuccess } from "../common/HttpResponse.js";

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
    const user: CreateUserInput = req.body;
    logger.info("hello");
    logger.debug(!this.userService);
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
}
