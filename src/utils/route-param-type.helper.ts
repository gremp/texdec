export class RouteParamTypeHelper {
  Query = {path: 'req.query', useFullObject: false}
  Param = {path: 'req.params', useFullObject: false}
  Body = {path: 'req.body', useFullObject: false}
  Res = {path: 'res', useFullObject: true}
  Req = {path: 'req', useFullObject: true}
  Next = {path: 'next', useFullObject: true}
}
