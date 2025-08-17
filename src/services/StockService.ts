import { ApiError } from "../common/ApiError.js";
import { getApiError } from "../common/HttpResponse.js";
import Container from "../container/Container.js";
import StockRepository from "../repositories/StockRepository.js";
import {
  CreateStockRequest,
  GetStocksQuery,
  StockResponse,
} from "../schemas/stockSchema.js";
import { logger } from "../utils/logger.js";
import { BaseService } from "./BaseService.js";
import FileUploadService from "./FileUploaderService.js";

export default class StockService extends BaseService {
  private readonly stockRepository: StockRepository;
  private readonly fileUploadService: FileUploadService;

  constructor(container: Container) {
    super(container);
    this.stockRepository = this.resolve<StockRepository>("StockRepository");
    this.fileUploadService =
      this.resolve<FileUploadService>("FileUploadService");
  }

  public readonly createStock = async (
    stockData: CreateStockRequest,
    imageFilePath: string
  ): Promise<StockResponse> => {
    const imageURL = await this.fileUploadService.uploadOnCloudinary(
      imageFilePath,
      {
        folder: "stock-images",
        processImage: true,
        width: 300,
        height: 300,
        quality: 85,
        displayName: `${stockData.symbol}-logo`,
      }
    );

    const newStock = await this.stockRepository.createStock({
      ...stockData,
      imageURL,
    });

    logger.notice("stock created: ", newStock);

    return {
      ...newStock,
      _id: newStock._id.toString(),
    };
  };

  public readonly updateStockPrice = async (
    id: string,
    updatedPrice: number
  ): Promise<StockResponse> => {
    try {
      const updatedStock = await this.stockRepository.updateStockById(id, {
        currentPrice: updatedPrice,
      });

      if (!updatedStock) {
        throw getApiError("STOCK_NOT_FOUND");
      }

      return {
        ...updatedStock,
        _id: updatedStock._id.toString(),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw getApiError(
        "INTERNAL_SERVER_ERROR",
        error,
        "failed to update stock price"
      );
    }
  };

  public readonly updateStockQuantity = async (
    id: string,
    newQuantity: number
  ): Promise<StockResponse> => {
    try {
      const updatedStock = await this.stockRepository.updateStockById(id, {
        quantity: newQuantity,
      });

      if (!updatedStock) {
        throw getApiError("NOT_FOUND", "Stock not found");
      }

      return {
        ...updatedStock,
        _id: updatedStock._id.toString(),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw getApiError(
        "INTERNAL_SERVER_ERROR",
        error,
        "failed to update stock quantity"
      );
    }
  };

  public readonly toggleStockStatus = async (
    id: string
  ): Promise<StockResponse> => {
    try {
      const toggledStock = await this.stockRepository.toggleStockStatus(id);

      if (!toggledStock) {
        throw getApiError("STOCK_NOT_FOUND");
      }

      return {
        ...toggledStock,
        _id: toggledStock._id.toString(),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw getApiError(
        "INTERNAL_SERVER_ERROR",
        error,
        "failed to update stock status"
      );
    }
  };

  public readonly updateStockImage = async (
    id: string,
    imageFilePath: string
  ): Promise<StockResponse> => {
    try {
      // Get existing stock to check current image
      const existingStock = await this.stockRepository.findById(id);
      if (!existingStock) {
        throw getApiError("STOCK_NOT_FOUND");
      }

      // Upload new image
      const newImageURL = await this.fileUploadService.uploadOnCloudinary(
        imageFilePath,
        {
          folder: "stock-images",
          processImage: true,
          width: 300,
          height: 300,
          quality: 85,
          displayName: `${existingStock.symbol}-logo`,
        }
      );

      if (existingStock.imageURL) {
        try {
          await this.fileUploadService.deleteFromCloudinary(
            existingStock.imageURL,
            true
          );
        } catch (error) {
          logger.warn("Failed to delete old stock image:", error);
        }
      }

      const updatedStock = await this.stockRepository.updateStockById(id, {
        imageURL: newImageURL,
      });

      if (!updatedStock) {
        throw getApiError("STOCK_NOT_FOUND");
      }

      return {
        ...updatedStock,
        _id: updatedStock._id.toString(),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw getApiError(
        "INTERNAL_SERVER_ERROR",
        error,
        "Failed to update stock image"
      );
    }
  };

  public readonly updateStockDescription = async (
    id: string,
    description: string
  ): Promise<StockResponse> => {
    try {
      const updatedStock = await this.stockRepository.updateStockById(id, {
        description,
      });

      if (!updatedStock) {
        throw getApiError("STOCK_NOT_FOUND");
      }

      return {
        ...updatedStock,
        _id: updatedStock._id.toString(),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw getApiError(
        "INTERNAL_SERVER_ERROR",
        error,
        "Failed to update stock description"
      );
    }
  };

  public readonly getAllStocks = async (
    query: GetStocksQuery
  ): Promise<StockResponse[]> => {
    try {
      const stocks = await this.stockRepository.getAllStocks(query);

      return stocks.map((stock) => ({
        ...stock,
        _id: stock._id.toString(),
      }));
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw getApiError(
        "INTERNAL_SERVER_ERROR",
        error,
        "Failed to fetch stocks"
      );
    }
  };
}
