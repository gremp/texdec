export class SingleConfig {
  private included: string[] = [];
  private excluded: string[] = [];
  private methodList: string[] | undefined;

  constructor(private type: string, private funcList: Function[]) {}

  exclude(excluded: string | string[]) {
    excluded = Array.isArray(excluded) ? excluded : [excluded];
    this.excluded.push(...excluded);
    return this;
  }

  include(included: string | string[]) {
    included = Array.isArray(included) ? included : [included];
    this.included.push(...included);
    return this;
  }

  getMethodList(controller: any): string[] {
    if (this.included.length && this.excluded.length)
      throw new Error(
        `Controller's ${controller.name} config set both included and excluded on ${this.type}. Only one can exist`,
      );

    const controllerMethods = Object.getOwnPropertyNames(controller.prototype);
    if (this.included.length) {
      return this.included.filter((func: string) => !!~controllerMethods.indexOf(func));
    } else {
      return controllerMethods.filter((func: string) => !~this.excluded.indexOf(func));
    }
  }

  getFuncList() {
    return this.funcList;
  }

  isForFunction(funcName: string, controller: Function) {
    if (!this.methodList) this.methodList = this.getMethodList(controller);
    return !!~this.methodList.findIndex((func) => func === funcName);
  }
}
