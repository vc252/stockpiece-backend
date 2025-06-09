import { Router } from "express";
import express from "express";

export default abstract class CommonRoutesConfig {
  private readonly _router: Router;

  constructor(
    public readonly name: string,
    public readonly basePath: string
  ) {
    this._router = express.Router();
  }

  get router() {
    return this._router;
  }

  abstract configurRoutes(): void;
}
