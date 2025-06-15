import CommonRoutesConfig from "../config/common.routes.config.js";
import express from "express";
import { logger } from "../utils/logger.js";

export default function registerRoutes(
  app: express.Application,
  routesDefs: {
    name: string;
    basePath: string;
    RouterClass: new (name: string, basePath: string) => CommonRoutesConfig;
  }[],
  basePrefix: string
): express.Application {
  routesDefs.forEach((routeDef) => {
    const routerInstance = new routeDef.RouterClass(
      routeDef.name,
      routeDef.basePath
    );

    routerInstance.configurRoutes();
    app.use(`${basePrefix}${routeDef.basePath}`, routerInstance.router);

    logger.notice(
      `registered route:${routeDef.name} on basePath:${routeDef.basePath}`
    );
  });

  return app;
}
