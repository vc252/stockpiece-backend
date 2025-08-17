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

  public readonly findById = async (id: string): Promise<Stock | null> => {
    const stock = await StockModel.findById(id).lean();

    if (!stock) {
      return null;
    }

    return parseDbResponseOrThrow<Stock>(stockSchema, stock);
  };

  public readonly findByName = async (name: string): Promise<Stock | null> => {
    const stock = await StockModel.findOne({ name }).lean();

    if (!stock) {
      return null;
    }

    return parseDbResponseOrThrow<Stock>(stockSchema, stock);
  };

  public readonly updateStockById = async (
    id: string,
    updateData: Partial<StockData>
  ): Promise<Stock | null> => {
    const updatedStock = await StockModel.findByIdAndUpdate(
      id,
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!updatedStock) {
      return null;
    }

    return parseDbResponseOrThrow<Stock>(stockSchema, updatedStock);
  };

  public readonly toggleStockStatus = async (
    id: string
  ): Promise<Stock | null> => {
    const toggledStock = await StockModel.findByIdAndUpdate(id, {
      $bit: {
        isActive: {
          xor: 1,
        },
      },
    });

    if (!toggledStock) {
      return null;
    }

    return parseDbResponseOrThrow<Stock>(stockSchema, toggledStock);
  };

  //when deleting a stock we need additional logic to add the money to people's account
  //who have invested in it
  //so we can write that logic later on
  public readonly deleteStock = async (id: string): Promise<Stock | null> => {
    const deletedStock = await StockModel.findByIdAndDelete(id).lean();

    if (!deletedStock) {
      return null;
    }

    return parseDbResponseOrThrow<Stock>(stockSchema, deletedStock);
  };
}
