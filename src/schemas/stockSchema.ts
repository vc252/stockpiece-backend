import mongoose from "mongoose";
import { z } from "zod";

const symbolSchema = z
  .string()
  .min(1, "Symbol required")
  .max(10, "Max 10 chars")
  .regex(/^[A-Z0-9]+$/, "Symbol must be uppercase alphanumerics only");

const stockSchema = z.object({
  _id: z.instanceof(mongoose.Types.ObjectId),
  name: z.string().min(1, "Name required").max(50),
  displayName: z.string().min(1, "Display name required").max(70),
  symbol: symbolSchema,
  currentPrice: z.number().positive("Price must be > 0"),
  imageURL: z.string().url("Invalid image URL"),
  quantity: z.number().int().nonnegative("Quantity must be >= 0"),
  description: z.string().max(500).optional(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const createStockRequestSchema = stockSchema
  .pick({
    name: true,
    displayName: true,
    symbol: true,
    quantity: true,
    description: true,
  })
  .extend({
    currentPrice: z.number().positive("Price must be > 0").optional(),
    isActive: z.boolean().optional(),
  });

type Stock = z.infer<typeof stockSchema>;
type CreateStockRequest = z.infer<typeof createStockRequestSchema>;
type StockResponse = Omit<Stock, "_id"> & {
  _id: string;
};
type StockData = CreateStockRequest & {
  imageURL: string;
};

export {
  stockSchema,
  createStockRequestSchema,
  Stock,
  CreateStockRequest,
  StockResponse,
  StockData,
};
