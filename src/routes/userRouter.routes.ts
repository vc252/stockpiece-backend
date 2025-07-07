import CommonRoutesConfig from "../config/common.routes.config.js";
import { createUserRequestSchema } from "../schemas/User.schema.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import validate from "../middlewares/validation.middleware.js";
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
      .post(
        validate(createUserRequestSchema),
        asyncHandler(this.userController.registerUser)
      );
  }
}
