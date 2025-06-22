import CommonRoutesConfig from "../config/common.routes.config.js";
import express from "express";
import { logger } from "../utils/logger.js";
import Container from "../container/Container.js";

export default function registerRoutes(
  app: express.Application,
  routesDefs: {
    name: string;
    basePath: string;
    RouterClass: new (
      name: string,
      basePath: string,
      Container: Container
    ) => CommonRoutesConfig;
  }[],
  basePrefix: string,
  Container: Container
): express.Application {
  routesDefs.forEach((routeDef) => {
    const routerInstance = new routeDef.RouterClass(
      routeDef.name,
      routeDef.basePath,
      Container
    );

    routerInstance.configurRoutes();
    app.use(`${basePrefix}/${routeDef.basePath}`, routerInstance.router);

    logger.notice(
      `registered route:${routeDef.name} on basePath: ${basePrefix}/${routeDef.basePath}`
    );
  });

  return app;
}
