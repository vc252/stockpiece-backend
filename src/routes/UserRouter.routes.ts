import CommonRoutesConfig from "../config/common.routes.config.js";
import {
  authRequestSchema,
  createUserRequestSchema,
  updateAvatarRequestSchema,
} from "../schemas/User.schema.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import validate from "../middlewares/validation.middleware.js";
import Container from "../container/Container.js";
import UserController from "../controllers/User.controller.js";
import { logger } from "../utils/logger.js";
import { verifyUserJwt } from "../middlewares/auth.middleware.js";

export default class UserRouter extends CommonRoutesConfig {
  private readonly userController: UserController;

  constructor(name: string, basePath: string, Container: Container) {
    super(name, basePath);

    this.userController = Container.resolve<UserController>("UserController");
    logger.debug(JSON.stringify(this.userController));
  }

  public configurRoutes(): void {
    this.router
      .route("/")
      .post(
        validate(createUserRequestSchema),
        asyncHandler(this.userController.registerUser)
      );

    this.router
      .route("/login")
      .post(
        validate(authRequestSchema),
        asyncHandler(this.userController.loginUser)
      );

    this.router
      .route("/avatar")
      .patch(
        verifyUserJwt,
        validate(updateAvatarRequestSchema),
        asyncHandler(this.userController.updateAvatar)
      );
  }
}
