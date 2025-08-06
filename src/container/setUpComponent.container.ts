import { Constructor } from "../common/types.common.js";
import Container from "./Container.js";

function registerComponents(
  Container: Container,
  componentsDef: {
    name: string;
    Class: Constructor<unknown>;
    options: string[];
  }[]
): void {
  componentsDef.forEach((component) => {
    Container.register(component.name, component.Class, component.options);
  });

  //this we can remove later if we want lazy loading
  componentsDef.forEach((component) => {
    Container.resolve(component.name);
  });
}

export { registerComponents };
