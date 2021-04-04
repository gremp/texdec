export interface LoggerLike {
  debug: (...messages: any[]) => void;
  info: (...messages: any[]) => void;
  warn: (...messages: any[]) => void;
  error: (...messages: any[]) => void;
}

export interface IParamExtraInfo {
  args: any[],
  type: Function,
  parameterName: string,
  castToType: boolean
}

export type TEX_DEC_SETTING_KEYS = 'castHelper'
                                  | 'webLogger'
                                  | 'routerLogger'
                                  | 'routeParamHelper'
                                  | 'baseRoute'
                                  | 'controllerDir'
