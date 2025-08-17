import CommonRoutesConfig from "../config/common.routes.config.js";
import Container from "../container/Container.js";
import StockController from "../controllers/StockController.js";
import { ImageUploader } from "../middlewares/multer.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import {
  createStockRequestSchema,
  updateStockDescriptionSchema,
  updateStockPriceSchema,
  updateStockQuantitySchema,
} from "../schemas/stockSchema.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import {
  checkPermissions,
  verifyAdminJwt,
} from "../middlewares/auth.middleware.js";
import { permissions } from "../common/constants.common.js";

export class StockRouter extends CommonRoutesConfig {
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
        validate(createStockRequestSchema),
        asyncHandler(this.stockController.createStock)
      );

    this.router
      .route("/:id/toggle-status")
      .patch(
        verifyAdminJwt,
        checkPermissions([permissions.UPDATE_STOCK]),
        asyncHandler(this.stockController.toggleStockStatus)
      );

    this.router.route("/:id/price").patch(
      verifyAdminJwt,
      checkPermissions([permissions.UPDATE_STOCK]),
      validate(updateStockPriceSchema),
      asyncHandler(this.stockController.updateStockPrice) // Correct method
    );

    this.router
      .route("/:id/quantity")
      .patch(
        verifyAdminJwt,
        checkPermissions([permissions.UPDATE_STOCK]),
        validate(updateStockQuantitySchema),
        asyncHandler(this.stockController.updateStockQuantity)
      );

    this.router
      .route("/:id/description")
      .patch(
        verifyAdminJwt,
        checkPermissions([permissions.UPDATE_STOCK]),
        validate(updateStockDescriptionSchema),
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
