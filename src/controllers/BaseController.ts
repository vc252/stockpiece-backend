import Container from "../container/Container.js";
import { ComponentName } from "../config/ComponentsDef.js";

export abstract class BaseController {
  constructor(private readonly container: Container) {}

  protected resolve<T>(serviceName: ComponentName): T {
    return this.container.resolve<T>(serviceName);
  }
}
