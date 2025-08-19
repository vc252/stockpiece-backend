import mongoose from "mongoose";
import { z } from "zod";
import { booleanSchema } from "./common.schema.js";

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
  currentPrice: z.coerce.number().positive("Price must be > 0"),
  imageURL: z.string().url("Invalid image URL"),
  quantity: z.coerce.number().int().nonnegative("Quantity must be >= 0"),
  description: z.string().max(500).optional(),
  isActive: booleanSchema,
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

const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });

const IdParamSchema = z.object({
  id: objectIdSchema,
});

const updateStockPriceSchema = stockSchema.pick({
  currentPrice: true,
});

const updateStockQuantitySchema = stockSchema.pick({
  quantity: true,
});

const updateStockDescriptionSchema = z.object({
  description: z.string().max(500),
});

const updateStockStatusSchema = stockSchema.pick({
  isActive: true,
});

const getStocksQuerySchema = z.object({
  isActive: booleanSchema.default(true),
  sortBy: z
    .enum(["name", "symbol", "currentPrice", "quantity", "createdAt"])
    .optional()
    .default("name"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export {
  stockSchema,
  createStockRequestSchema,
  getStocksQuerySchema,
  updateStockPriceSchema,
  updateStockQuantitySchema,
  updateStockDescriptionSchema,
  updateStockStatusSchema,
  IdParamSchema,
};
