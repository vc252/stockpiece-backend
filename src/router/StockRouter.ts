import BaseRouter from "./BaseRouter.js";
import Container from "../container/Container.js";
import StockController from "../controllers/StockController.js";
import { ImageUploader } from "../middlewares/multerMiddleware.js";
import {
  validateRequestBody,
  validateRequestRouteParams,
} from "../middlewares/validationMiddleware.js";
import {
  createStockRequestSchema,
  IdParamSchema,
  updateStockDescriptionSchema,
  updateStockPriceSchema,
  updateStockQuantitySchema,
} from "../schemas/stockSchema.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  checkPermissions,
  verifyAdminJwt,
} from "../middlewares/authMiddleware.js";
import { permissions } from "../common/constants.js";

export default class StockRouter extends BaseRouter {
  private readonly stockController: StockController;

  constructor(name: string, basePath: string, container: Container) {
    super(name, basePath, container);
    this.stockController =
      container.resolve<StockController>("StockController");
  }

  configurRoutes(): void {
    this.router
      .route("/")
      .post(
        verifyAdminJwt,
        checkPermissions([permissions.ADD_STOCK]),
        ImageUploader.single("imageURL"),
        validateRequestBody(createStockRequestSchema),
        asyncHandler(this.stockController.createStock)
      );

    this.router
      .route("/:id/toggle-status")
      .patch(
        verifyAdminJwt,
        checkPermissions([permissions.UPDATE_STOCK]),
        validateRequestRouteParams(IdParamSchema),
        asyncHandler(this.stockController.toggleStockStatus)
      );

    this.router.route("/:id/price").patch(
      verifyAdminJwt,
      checkPermissions([permissions.UPDATE_STOCK]),
      validateRequestBody(updateStockPriceSchema),
      validateRequestRouteParams(IdParamSchema),
      asyncHandler(this.stockController.updateStockPrice) // Correct method
    );

    this.router
      .route("/:id/quantity")
      .patch(
        verifyAdminJwt,
        checkPermissions([permissions.UPDATE_STOCK]),
        validateRequestBody(updateStockQuantitySchema),
        validateRequestRouteParams(IdParamSchema),
        asyncHandler(this.stockController.updateStockQuantity)
      );

    this.router
      .route("/:id/description")
      .patch(
        verifyAdminJwt,
        checkPermissions([permissions.UPDATE_STOCK]),
        validateRequestBody(updateStockDescriptionSchema),
        validateRequestRouteParams(IdParamSchema),
        asyncHandler(this.stockController.updateStockDescription)
      );

    this.router
      .route("/:id/image")
      .patch(
        verifyAdminJwt,
        checkPermissions([permissions.UPDATE_STOCK]),
        ImageUploader.single("imageURL"),
        asyncHandler(this.stockController.updateStockImage)
      );
  }
}
