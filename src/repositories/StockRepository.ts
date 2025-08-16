import StockModel from "../models/stockModel.js";
import { Stock, StockData, stockSchema } from "../schemas/stockSchema.js";
import { parseDbResponseOrThrow } from "../utils/parseOrThrow.util.js";

export default class StockRepository {
  public readonly createStock = async (
    stockData: StockData
  ): Promise<Stock> => {
    const createdStock = await StockModel.create(stockData);

    return parseDbResponseOrThrow<Stock>(stockSchema, createdStock.toObject());
  };

  public readonly findByName = async (name: string): Promise<Stock | null> => {
    const stock = await StockModel.findOne({ name }).lean();

    if (!stock) {
      return null;
    }

    return parseDbResponseOrThrow<Stock>(stockSchema, stock);
  };
}
