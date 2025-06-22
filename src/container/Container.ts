import { Constructor } from "../common/types.common.js";

export default class Container {
  private static instance: Container;

  private readonly registry: Map<
    string,
    { Class: Constructor<unknown>; dependencies: string[] }
  >;
  private readonly components: Map<string, unknown>;

  private constructor() {
    this.registry = new Map();
    this.components = new Map();
  }

  public static getInstance(): Container {
    if (Container.instance) return Container.instance;
    Container.instance = new Container();
    return Container.instance;
  }

  //this will be used to register all the classes for which we need
  //instance for we are doing this because we need to first have
  //all the dependencies reference before we can initialize them
  //we are not using this Class anywhere so no need to pass a type to it
  public register(
    name: string,
    Class: Constructor<unknown>,
    dependencies: string[]
  ) {
    this.registry.set(name, {
      Class,
      dependencies,
    });
  }

  public resolve<T>(name: string): T {
    if (this.components.get(name)) {
      return this.components.get(name) as T;
    }

    const entry = this.registry.get(name);

    if (!entry) {
      throw Error(`${name} not registered in registry`);
    }

    //similary we are not using these dependencies so we can use unkown here
    entry.dependencies.forEach((dep) => {
      this.resolve<unknown>(dep);
    });

    //are u sure this is how we initialize the class
    //I think yes these ...deps will already be resolved
    //and I am returning the instance of these Classes
    const instance = new entry.Class(Container.instance);

    this.components.set(name, instance);

    return instance as T;
  }
}
