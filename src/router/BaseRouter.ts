import { Router } from "express";
import express from "express";
import Container from "../container/Container.js";
import { ComponentName } from "../config/ComponentsDef.js";

export default abstract class BaseRouter {
  private readonly _router: Router;

  constructor(
    public readonly name: string,
    public readonly basePath: string,
    private readonly _container: Container
  ) {
    this._router = express.Router();
  }

  protected resolve<T>(componentName: ComponentName): T {
    return this._container.resolve<T>(componentName);
  }

  get router() {
    return this._router;
  }

  abstract configurRoutes(): void;
}
