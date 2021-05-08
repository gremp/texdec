import {TEX_DEC_SETTING_KEYS} from '../interfaces'
import {CastHelper} from './cast.helper'
import {RouteParamTypeHelper} from './route-param-type.helper'

export class TExDecSettings {
  static __instance: TExDecSettings
  private setings: any = {}
  private readlist: Set<string> = new Set()
  private defaults: { [key: string]: any } = {
    'castHelper': CastHelper,
    'routeParamHelper': RouteParamTypeHelper,
    'webLogger': console,
    'routerLogger': console,
    'baseRoute': '',

  }


  constructor() {
    if (TExDecSettings.__instance) return TExDecSettings.__instance
    else TExDecSettings.__instance = this
  }

  static getInstance() {
    return new TExDecSettings()
  }

  set(key: TEX_DEC_SETTING_KEYS, value: any) {
    if (this.readlist.has(key)) throw new Error(`TExDecSettings key "${key}" has already been read and cannot change`)
    this.setings[key] = value
  }

  get(key: TEX_DEC_SETTING_KEYS) {
    this.readlist.add(key)
    return this.setings[key] || this.defaults[key] || undefined
  }
}

