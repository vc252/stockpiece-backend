import CommonRoutesConfig from "../config/common.routes.config";
import Container from "../container/Container.js";
import StockController from "../controllers/StockController.js";
import { ImageUploader } from "../middlewares/multer.middleware";
import validate from "../middlewares/validation.middleware";
import { createStockRequestSchema } from "../schemas/stockSchema.js";
import asyncHandler from "../utils/asyncHandler.util";

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
        validate(createStockRequestSchema),
        ImageUploader.single("imageURL"),
        asyncHandler(this.stockController.createStock)
      );
  }
}
