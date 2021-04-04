import { getRecursiveFiles } from './read-files-recursive';
import path from 'path';
import {TExDecSettings} from './utils/texdec-settings.singleton'


export class WebModules {
  static async init() {
    const texDecSettings = TExDecSettings.getInstance()
    const controllerDir = texDecSettings.get('controllerDir')
    if (!controllerDir) throw new Error(`The directory to search for controllers is not set. You have to set at  least 'controllerDir' in the 'TExDecSettings'`)
    const logger = texDecSettings.get('webLogger')
    const allFiles = await getRecursiveFiles(controllerDir);
    const controllers = allFiles.filter((f: string) => path.basename(f).match(/.+\.controller\.js/g));

    for (const controller of controllers) {
      const filename = path.basename(controller).split('.controller.')[0]
      logger.info(`Loading ${filename} controller`);
      require(controller);
    }
    logger.info('All modules loaded');
  }
}
