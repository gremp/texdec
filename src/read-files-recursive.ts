import {promises as fs} from 'fs'
import {resolve} from 'path'
import {Dirent} from 'fs'

export async function getRecursiveFiles(dir: string): Promise<string[]> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent: Dirent) => {
    const res: string = resolve(dir, dirent.name);
    return dirent.isDirectory() ? getRecursiveFiles(res) : [res];
  }));
  return Array.prototype.concat(...files);
}
