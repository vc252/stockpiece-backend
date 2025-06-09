import { ApiResponse } from "../common/ApiResponse.js";
import CommonRoutesConfig from "../config/common.routes.config.js";
import express from "express";

export default class UserRouter extends CommonRoutesConfig {
  constructor(name: string, basePath: string) {
    super(name, basePath);
  }

  configurRoutes(): void {
    this.router
      .route("/")
      .get((req: express.Request, res: express.Response) => {
        res
          .status(200)
          .json(
            new ApiResponse<null>(
              200,
              "get request at api/v2/users",
              null,
              `${this.basePath}`
            )
          );
      })
      .post((req: express.Request, res: express.Response) => {
        res
          .status(200)
          .json(
            new ApiResponse<null>(
              200,
              "post request at api/v2/users",
              null,
              `${this.basePath}`
            )
          );
      });
  }
}
