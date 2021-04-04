import path from 'path';
import { Express, NextFunction, Router, Request, Response } from 'express';
import { SingleConfig } from '../controller-related/single-config';
import { LoggerLike } from '../interfaces';
import {TExDecSettings} from '../utils/texdec-settings.singleton'
import {ControllerConfig, IControllerConfig} from '../controller-related/controller-config'

let routerDecorator: RouterDecorator;

export class RouterDecorator {

  public static init(expressApp: Express) {
    if (routerDecorator) throw new Error('RouterDecorator has been already initialized');
    return new RouterDecorator(expressApp);
  }

  private endpoints: IEndpoint[] = [];
  private app!: Express;
  private mainRouter = Router();
  private logger!: LoggerLike
  private urlPrefix!: string

  constructor(expressApp?: Express) {
    if (routerDecorator) return routerDecorator;
    if (!expressApp) throw new Error('Initialization of RouterDecorator requires express app instance');
    const texDecSettings = TExDecSettings.getInstance()
    this.logger = texDecSettings.get('routerLogger')
    this.urlPrefix = texDecSettings.get('baseRoute')
    this.app = expressApp;
    this.app.use(this.mainRouter);

    routerDecorator = this;
    return routerDecorator;
  }

  addController(controller: any, path: string) {
    this.createControllerRoutes(controller, path);
  }

  addEndpoint(
    controller: Function,
    endpointMethodName: string,
    path: string,
    endpoint: IEndpointFunction,
    method: IMethod,
  ) {
    this.endpoints.push({ controller, path, func: endpoint, endpointMethodName, method });
  }

  createControllerRoutes(controller: any, basePath: string) {
    const indexes = this.endpoints
      .reduce((a: number[], e, i) => (e.controller === controller ? a.concat(i) : a), [])
      .reverse();

    const endpoints = [];
    for (const index of indexes) endpoints.push(...this.endpoints.splice(index, 1));
    const controllerRouter = Router();
    endpoints.reverse().forEach(this.createEndpoint.bind(this, controllerRouter));
    const endpointBasePath = this.getEndpointsBasePath(endpoints, basePath);
    this.mainRouter.use(endpointBasePath, controllerRouter);
      this.logger.info(
        `Sub-routes ${endpoints.map((e) => `${e.method.toUpperCase()}: "${e.path}"`).join(', ')} registered for route "${endpointBasePath}"`,
      );
  }

  createEndpoint(router: Router, endpoint: IEndpoint) {
    // @ts-ignore
    const controllerConfig = new endpoint.controller._controllerConfig();
    const { middlewareConfigs } = controllerConfig.getAll();
    const routeMiddlewaresConfigs = middlewareConfigs.filter((mw: SingleConfig) =>
      mw.isForFunction(endpoint.endpointMethodName, endpoint.controller),
    );
    const routeMiddlewares = routeMiddlewaresConfigs.map((rm: SingleConfig) => rm.getFuncList()).flat();
    routeMiddlewares.push(endpoint.func);

    router[endpoint.method](endpoint.path, ...routeMiddlewares);
  }

  getEndpointsBasePath(endpoints: IEndpoint[], baseRoute: string) {
    // @ts-ignore
    const RouteControllerConfig = endpoints && endpoints[0] && endpoints[0].controller && endpoints[0].controller._controllerConfig
    const controllerConfig = new RouteControllerConfig()
    const { baseRoute: customBaseRoute } = controllerConfig.getAll()
    const urlPrefix = customBaseRoute || this.urlPrefix
    return this.pathJoin(urlPrefix, baseRoute)
  }

  pathJoin(...args: string[]) {
    args.unshift('/')
    return args
      .join('/')
      .replace(/(\/+)/g, '/') // Replace more than one slashes to one
      .replace(/\/$/g, '') // Remove the last slash if exists
  }
}



type IMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
type IEndpointFunction = (req: Request, res: Response, next: NextFunction) => any;

interface IEndpoint {
  controller: Function;
  path: string;
  func: IEndpointFunction;
  endpointMethodName: string;
  method: IMethod;
}
