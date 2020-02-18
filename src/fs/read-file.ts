import { readFile as readf } from 'fs';
import { join } from 'path';
import { File, FileIOOptions } from './types';


export function readFile(options: FileIOOptions = {}) {
  const _root = options.root || '';
  return function(f: string | File<undefined>): Promise<File<string>> {
    let path: string; 
    let root: string = _root;
    if (typeof f === 'string') path = f;
    else {
      path = f.path;
      root = root || f.root;
    }

    const abspath = join(root, path);
    return new Promise((resolve, reject) => {
      readf(abspath, (err, res) => {
        if (err) reject(err);
        else resolve({ path, root, content: res.toString() });
      });
    });
  }
}
