import Container from "../container/Container.js";
import StockRepository from "../repositories/StockRepository.js";
import { CreateStockRequest, StockResponse } from "../schemas/stockSchema.js";
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

    return {
      ...newStock,
      _id: newStock._id.toString(),
    };
  };
}
