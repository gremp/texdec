 import { Express } from 'express'
 import {RouterDecorator} from './decorators/router.decorator'
 import {WebModules} from './web-modules'

export class TExDec {
  static async init(app: Express) {
    RouterDecorator.init(app)
    return WebModules.init()

  }
}
