import { Controller } from "../types/commonTypes.js";
import { Request, Response, NextFunction } from "express";

const asyncHandler =
  (func: Controller) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next);
    } catch (err) {
      next(err);
    }
  };

export default asyncHandler;
