import { Request, Response, NextFunction } from "express";
import Container from "../container/Container.js";
import { BaseController } from "./BaseController.js";
import StockService from "../services/StockService.js";
import { ApiResponse } from "../common/ApiResponse.js";
import {
  CreateStockRequest,
  GetStocksQuery,
  StockResponse,
  UpdateStockDescription,
  UpdateStockPrice,
  UpdateStockQuantity,
} from "../schemas/stockSchema.js";
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

  public readonly getAllStocks = async (
    req: Request<object, object, object, unknown>,
    res: Response<ApiResponse<StockResponse[]>>,
    _: NextFunction
  ): Promise<void> => {
    const query = req.query as GetStocksQuery;
    const stocks = await this.stockService.getAllStocks(query);

    res
      .status(HttpSuccess.OK.statusCode)
      .json(
        new ApiResponse<StockResponse[]>(
          HttpSuccess.OK.statusCode,
          "Stocks fetched successfully",
          stocks
        )
      );
  };

  public readonly updateStockPrice = async (
    req: Request<{ id?: string }, object, UpdateStockPrice>,
    res: Response<ApiResponse<StockResponse>>,
    _: NextFunction
  ): Promise<void> => {
    const id = req.params as string;
    const priceData = req.body;
    const updatedStock = await this.stockService.updateStockPrice(
      id,
      priceData.currentPrice
    );

    res
      .status(HttpSuccess.OK.statusCode)
      .json(
        new ApiResponse<StockResponse>(
          HttpSuccess.OK.statusCode,
          "Stock price updated successfully",
          updatedStock
        )
      );
  };

  public readonly updateStockQuantity = async (
    req: Request<{ id?: string }, object, UpdateStockQuantity>,
    res: Response<ApiResponse<StockResponse>>,
    _: NextFunction
  ): Promise<void> => {
    const id = req.params as string;
    const quantityData = req.body;
    const updatedStock = await this.stockService.updateStockQuantity(
      id,
      quantityData.quantity
    );

    res
      .status(HttpSuccess.OK.statusCode)
      .json(
        new ApiResponse<StockResponse>(
          HttpSuccess.OK.statusCode,
          "Stock quantity updated successfully",
          updatedStock
        )
      );
  };

  public readonly updateStockDescription = async (
    req: Request<{ id?: string }, object, UpdateStockDescription>,
    res: Response<ApiResponse<StockResponse>>,
    _: NextFunction
  ): Promise<void> => {
    const id = req.params as string;
    const descriptionData = req.body;
    const updatedStock = await this.stockService.updateStockDescription(
      id,
      descriptionData.description
    );

    res
      .status(HttpSuccess.OK.statusCode)
      .json(
        new ApiResponse<StockResponse>(
          HttpSuccess.OK.statusCode,
          "Stock description updated successfully",
          updatedStock
        )
      );
  };

  public readonly toggleStockStatus = async (
    req: Request<{ id?: string }, object, object>,
    res: Response<ApiResponse<StockResponse>>,
    _: NextFunction
  ): Promise<void> => {
    const id = req.params.id as string;
    const updatedStock = await this.stockService.toggleStockStatus(id);

    res
      .status(HttpSuccess.OK.statusCode)
      .json(
        new ApiResponse<StockResponse>(
          HttpSuccess.OK.statusCode,
          "Stock status updated successfully",
          updatedStock
        )
      );
  };

  public readonly updateStockImage = async (
    req: Request<{ id?: string }>,
    res: Response<ApiResponse<StockResponse>>,
    _: NextFunction
  ): Promise<void> => {
    const id = req.params.id as string;
    const imageFile = req.file?.path;

    if (!imageFile) {
      throw getApiError("FILE_REQUIRED");
    }

    const updatedStock = await this.stockService.updateStockImage(
      id,
      imageFile
    );

    res
      .status(HttpSuccess.OK.statusCode)
      .json(
        new ApiResponse<StockResponse>(
          HttpSuccess.OK.statusCode,
          "Stock image updated successfully",
          updatedStock
        )
      );
  };
}
