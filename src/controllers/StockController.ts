import { Request, Response, NextFunction } from "express";
import Container from "../container/Container.js";
import { BaseController } from "./BaseController.js";
import StockService from "../services/StockService.js";
import { ApiResponse } from "../common/ApiResponse.js";
import { CreateStockRequest, StockResponse } from "../schemas/stockSchema.js";
import { HttpSuccess, getApiError } from "../common/HttpResponse.js";

export default class StockController extends BaseController {
  private readonly stockService: StockService;

  constructor(container: Container) {
    super(container);
    this.stockService = container.resolve<StockService>("StockService");
  }

  public readonly createStock = async (
    req: Request<object, object, CreateStockRequest>,
    res: Response<ApiResponse<StockResponse>>,
    _: NextFunction
  ): Promise<void> => {
    const stockData = req.body;
    const imageFile = req.file?.path;

    if (!imageFile) {
      throw getApiError("FILE_REQUIRED");
    }

    const createdStock = await this.stockService.createStock(
      stockData,
      imageFile
    );

    res
      .status(HttpSuccess.CREATED.statusCode)
      .json(
        new ApiResponse<StockResponse>(
          HttpSuccess.CREATED.statusCode,
          "Stock created successfully",
          createdStock
        )
      );
  };
}
