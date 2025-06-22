import { ApiResponse } from "../common/ApiResponse.js";
import CommonRoutesConfig from "../config/common.routes.config.js";
import { Request, Response } from "express";
import { createUserSchema, User, userSchema } from "../schemas/User.schema.js";
import asyncHandler from "../utils/asyncHandler.js";
import validate from "../middlewares/validation.middleware.js";
import { UserService } from "../common/types.common.js";
import Container from "../container/Container.js";
import UserController from "../controllers/User.controller.js";
import { logger } from "../utils/logger.js";

export default class UserRouter extends CommonRoutesConfig {
  private readonly userController: UserController;

  constructor(name: string, basePath: string, Container: Container) {
    super(name, basePath);

    this.userController = Container.resolve<UserController>("userController");
    logger.debug(JSON.stringify(this.userController));
  }

  public configurRoutes(): void {
    this.router
      .route("/user")
      .post(validate(createUserSchema), this.userController.registerUser);
  }
}
