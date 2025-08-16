import CommonRoutesConfig from "../config/common.routes.config.js";
import {
  authRequestSchema,
  createUserRequestSchema,
} from "../schemas/User.schema.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import validate from "../middlewares/validation.middleware.js";
import Container from "../container/Container.js";
import UserController from "../controllers/UserController.js";
import { verifyUserJwt } from "../middlewares/auth.middleware.js";
import { ImageUploader } from "../middlewares/multer.middleware.js";

export default class UserRouter extends CommonRoutesConfig {
  private readonly userController: UserController;

  constructor(name: string, basePath: string, container: Container) {
    super(name, basePath, container);

    this.userController = this.resolve<UserController>("UserController");
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
        ImageUploader.single("avatar"),
        asyncHandler(this.userController.updateAvatar)
      );
  }
}
