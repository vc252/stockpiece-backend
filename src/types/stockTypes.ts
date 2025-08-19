import { z } from "zod";
import {
  stockSchema,
  createStockRequestSchema,
  getStocksQuerySchema,
  updateStockPriceSchema,
  updateStockQuantitySchema,
  updateStockDescriptionSchema,
  updateStockStatusSchema,
} from "../schemas/stockSchema.js";

type GetStocksQuery = z.infer<typeof getStocksQuerySchema>;
type UpdateStockPrice = z.infer<typeof updateStockPriceSchema>;
type UpdateStockQuantity = z.infer<typeof updateStockQuantitySchema>;
type UpdateStockDescription = z.infer<typeof updateStockDescriptionSchema>;
type UpdateStockStatus = z.infer<typeof updateStockStatusSchema>;
type Stock = z.infer<typeof stockSchema>;
type CreateStockRequest = z.infer<typeof createStockRequestSchema>;
type StockResponse = Omit<Stock, "_id"> & {
  _id: string;
};
type StockData = CreateStockRequest & {
  imageURL: string;
};

export {
  Stock,
  CreateStockRequest,
  GetStocksQuery,
  StockResponse,
  StockData,
  UpdateStockPrice,
  UpdateStockQuantity,
  UpdateStockDescription,
  UpdateStockStatus,
};
