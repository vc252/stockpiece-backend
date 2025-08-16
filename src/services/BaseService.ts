import { ComponentName } from "../config/ComponentsDef.js";
import Container from "../container/Container.js";

export abstract class BaseService {
  constructor(private readonly container: Container) {}

  protected resolve<T>(serviceName: ComponentName): T {
    return this.container.resolve<T>(serviceName);
  }
}
