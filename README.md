# TExDec

### Yet another typescript web framework

> ### Installation
>
>```shell
>mkdir mywebproject
>cd mywebproject
>npm init
>npm i typescript
>./node_modules/.bin/tsc --init
>npm i texdec express @types/express @types/node
>```
>
> go to tsconfig.json and set 
> - `experimentalDecorators` and `emitDecoratorMetadata` to `true`
> - `target` to `es2019`

> ### Set up entry file
>
>on entry file (e.x `server.ts`) the usual express stuff
>```
>export const app: Express = express()
>app.use(express.urlencoded())
>app.use(express.json())
>```
>
>next thing is to get the TExDecSettings class
>```typescript
>import {TExDecSettings} from 'texdec'
>
>const texDecSettings = TExDecSettings.getInstance()
>```
>
>the only option we have to set for TExDec to work is the `controllerDir`
>```typescript
>texDecSettings.set('controllerDir', path.join(__dirname, 'controllers'))
>```
>TExDec will search in the given path for files with name matching `*.controller` and load them
>
>and then we execute `TExDec.init(app)` in order to find all the controller files and load the routes.
>
>```typescript
>import {TExDec} from 'texdec'
>import {Server} from 'http'
>
>TExDec.init(app).then(() => {
>  const http = new Server(app)
>  http.listen(3000, () => {
>    console.info(`server started at http://localhost:${3000}`)
>  })
>})
>```
>`TExDec.init` returns a promise which is resolved when all the routes from the controller files have been loaded. When the routes are loaded we can instantiate the http server.

> ### Our first controller
> create the directory structure `controllers/cats`
>
> Example controller:
>
> inside `controllers/cats` create the files `cats.controller.ts`
> > cats.controller.ts
> >```typescript
> >import {Controller, Get, Param, Post, Query, Body} from 'texdec'
> >import {CatsConfig} from './cats.config'
> >
> >@Controller('cats', CatsConfig)
> >class CatsController {
> >
> >  public cats: string[]
> >
> >  @Get('/')
> >  getMany(
> >    @Query() search: string,
> >  ) {
> >    if (search) return this.cats.filter(cat => (cat.indexOf(search) > -1))
> >    else return cats
> >  }
> >
> >  @Get('/:id')
> >  getOne(
> >    @Param('id') index: number,
> >  ) {
> >    return this.cats[index]
> >  }
> >
> >  @Post('/')
> >  insertOne(
> >    @Body() name: string,
> >  ) {
> >    this.cats.push(name)
> >    return this.cats
> >  }
> >}
> >```
> Class decorator `@Controller(baseRoute: string, controllerConfig?: IControllerConfig)`
>
> Params
> - `baseRoute` the main route of the controller
> - `controllerConfig` the configuration class of the controller
>
> Method Decorators:
>  - `@Get(route: string, validationObj?: IValidationObj)`
>  - `@Post(route: string, validationObj?: IValidationObj)`
>  - `@Put(route: string, validationObj?: IValidationObj)`
>  - `@Delete(route: string, validationObj?: IValidationObj)`
>  - `@Patch(route: string, validationObj?: IValidationObj)`
>
> Params
> - `route` the route of the method
> - `validationObj` the validation object of the incoming parameters
>
> Method Parameter Decorators
>
> > Match Query parameters
> >
> > `@Query(parameterName?: string | null | undefined, castToType?: boolean)`
>
> > Match url parameters
> >
> > `@Param(parameterName?: string | null | undefined, castToType?: boolean)`
>
> > Match body parameters (only if incomming body is json format)
> >
> > `@Body(parameterName?: string | null | undefined, castToType?: boolean)`
>
> > The Response Object
> >
> > `@Res()`
>
> > The Request Object
> >
> > `@Req()`
>
> Params
> - `parameterName` (Optional) the name of the incoming key - if not set the name of the variable will be used.
> - `castToType` (Optional) defaults to `true`. If set to `false` the incoming variable will be cast to the type that is declared

> ### Our Controller config
> inside `controllers/cats` create the file `cats.config.ts`
> ```typescript
> import {ControllerConfig} from 'texdec'
>
> export class CatsConfig extends ControllerConfig {
>   constructor() {
>       super();
>       this.middleware([]).include('getMany')
>       this.middleware([]).exclude('getOne')
>       this.baseRoute()
>   }
> }
> ```
> class methods
> - `middleware` accepts and array of function (expressjs middlewares) that will be used in all the controllers methods.
> you can excude specific methods from using the middleware with the chain method `excude` or use the middleware 
> in a specific set of methods with the chain method `include`. Both `include` and `exclude` accept either a string 
> or an array of strings.
> 
> 
> - `baseRoute` if you want to overide the base route that you set on `texdecSettings`
> 

> ### TExDec Options
>via the `texDecSettings` we can configure some options.
>
> available options are:
>```
>castHelper
>webLogger
>routerLogger
>routeParamHelper
>baseRoute
>controllerDir
>```
>
> `castHelper` (Default: `Class: CastHelper`) is the class that contains the methods that casts the variables in the controllers. You can extend the default CastHelper class and write your own cast functions
> 
> `webLogger` (Default: `console`) the web logger
> 
> `routerLogger` (Default: `console`) the router logger
> 
> `routeParamHelper` You can create custom controller method params with this option...
> 
> `baseRoute` base route is the route all the controllers will be under





