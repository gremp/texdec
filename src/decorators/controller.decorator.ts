import { RouterDecorator } from './router.decorator';
import { IControllerConfig } from '../controller-related/controller-config';

export function Controller(baseRoute: string, controllerConfig?: IControllerConfig | any) {
  return <T extends new (...args: any[]) => {}>(constructor: T) => {
    const routerDecorator = new RouterDecorator();
    const instance = new constructor
    // @ts-ignore
    constructor._controllerConfig = controllerConfig;
    // @ts-ignore
    constructor._instance = instance
    routerDecorator.addController(constructor, baseRoute);
  };
}

