import mongoose from "mongoose";
import { z } from "zod";
import { windowStatus, windowTypes } from "../common/constants.js";

const windowTypeSchema = z.enum(
  Object.values(windowTypes) as [string, ...string[]]
);

const windowStatusSchema = z.enum(
  Object.values(windowStatus) as [string, ...string[]]
);

//should we reopen this window again and maybe try trading in it
//we have the price history associated with it already availabe
//and we can search the chapter that we want the price for
//basically the orders associated with this price and those can be
//used filtered out on the basis of chapter
//how will i calculate the total stocks in market in that window
//most probably i can't so that would be a better metric to have in the window
//for total users i need to sum all the unique users within the transaction
//we can have this information in the price update model
//which will have the quantity of that stock when the price was updated
//it will have the price at that point the newPrice
//both of them will also give the market value during that window
//using the participation we can form streaks of trading
//which can be given as batches to them
const tradingWindowSchema = z.object({
  _id: z.instanceof(mongoose.Types.ObjectId),
  startTime: z.date(),
  endTime: z.date(),
  tradingStartTime: z.date().optional(),
  tradingEndTime: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),

  context: z.object({
    type: windowTypeSchema,
    number: z.number(),
  }),
  status: windowStatusSchema,

  //window metrics
  totalUsers: z.number().optional(),
  totalHolders: z.number().optional(), //users who have the stock
  totalParticipants: z.number().optional(), //users who took part in the trade
  totalBuyVolume: z.number().optional(),
  totalSellVolume: z.number().optional(),
  totalMarketVolume: z.number().optional(),
});

type TradingWindow = z.infer<typeof tradingWindowSchema>;

export { tradingWindowSchema, TradingWindow };
