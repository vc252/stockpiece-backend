import BaseRouter from "./BaseRouter.js";
import {
  authRequestSchema,
  createUserRequestSchema,
} from "../schemas/User.schema.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  validateRequestBody,
  validateRequestQueryParams,
} from "../middlewares/validationMiddleware.js";
import Container from "../container/Container.js";
import UserController from "../controllers/UserController.js";
import { verifyUserJwt } from "../middlewares/authMiddleware.js";
import { ImageUploader } from "../middlewares/multerMiddleware.js";
import { restrictStocksByRole } from "../middlewares/filterStockFilter.js";
import StockController from "../controllers/StockController.js";
import { getStocksQuerySchema } from "../schemas/stockSchema.js";

export default class UserRouter extends BaseRouter {
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
        validateRequestQueryParams(getStocksQuerySchema),
        restrictStocksByRole,
        asyncHandler(this.stockController.getAllStocks)
      );
  }
}
