import { SingleConfig } from './single-config';

export abstract class ControllerConfig implements IControllerConfig {
  private _middlewares: SingleConfig[] = [];
  private _asyncHooks: SingleConfig[] = [];
  private _hooks: SingleConfig[] = [];
  private baseRouteOveride: string | undefined
  protected constructor() {}

  middleware(middlewares: Function[]): SingleConfig {
    const middlewareConfig = new SingleConfig('middleware', middlewares);
    this._middlewares.push(middlewareConfig);
    return middlewareConfig;
  }

  asyncHooks(hooks: any[]): SingleConfig {
    const asyncHooksConfig = new SingleConfig('asyncHooks', hooks);
    this._asyncHooks.push(asyncHooksConfig);
    return asyncHooksConfig;
  }

  hooks(hooks: any[]): SingleConfig {
    const hooksConfig = new SingleConfig('hooks', hooks);
    this._hooks.push(hooksConfig);
    return hooksConfig;
  }


  getAll(): IControllerConfigResult {
    return {
      middlewareConfigs: this._middlewares,
      asyncHookConfigs: this._asyncHooks,
      hookConfigs: this._hooks,
      baseRoute: this.baseRouteOveride
    };
  }

  baseRoute(value: string) {
    this.baseRouteOveride = value
  }
}

export interface IControllerConfig {
  middleware(funcArr: Function[]): SingleConfig;

  asyncHooks(funcArr: Function[]): SingleConfig;

  hooks(funcArr: Function[]): SingleConfig;

  getAll(): IControllerConfigResult;
}

export interface IControllerConfigResult {
  middlewareConfigs: SingleConfig[];
  asyncHookConfigs: SingleConfig[];
  hookConfigs: SingleConfig[];
  baseRoute: string | undefined
}
