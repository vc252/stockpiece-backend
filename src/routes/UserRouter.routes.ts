import CommonRoutesConfig from "../config/common.routes.config.js";
import {
  authRequestSchema,
  createUserRequestSchema,
} from "../schemas/User.schema.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import {
  validateRequestBody,
  validateRequestQueryParams,
} from "../middlewares/validation.middleware.js";
import Container from "../container/Container.js";
import UserController from "../controllers/UserController.js";
import { verifyUserJwt } from "../middlewares/auth.middleware.js";
import { ImageUploader } from "../middlewares/multer.middleware.js";
import { restrictStocksByRole } from "../middlewares/filterStockFilter.js";
import StockController from "../controllers/StockController.js";
import { getStocksQuerySchema } from "../schemas/stockSchema.js";

export default class UserRouter extends CommonRoutesConfig {
  private readonly userController: UserController;
  private readonly stockController: StockController;

  constructor(name: string, basePath: string, container: Container) {
    super(name, basePath, container);

    this.userController = this.resolve<UserController>("UserController");
    this.stockController = this.resolve<StockController>("StockController");
  }

  public configurRoutes(): void {
    this.router
      .route("/")
      .post(
        validateRequestBody(createUserRequestSchema),
        asyncHandler(this.userController.registerUser)
      );

    this.router
      .route("/login")
      .post(
        validateRequestBody(authRequestSchema),
        asyncHandler(this.userController.loginUser)
      );

    this.router
      .route("/avatar")
      .patch(
        verifyUserJwt,
        ImageUploader.single("avatar"),
        asyncHandler(this.userController.updateAvatar)
      );

    this.router
      .route("/getAllStocks")
      .get(
        verifyUserJwt,
        restrictStocksByRole,
        validateRequestQueryParams(getStocksQuerySchema),
        asyncHandler(this.stockController.getAllStocks)
      );
  }
}
