import { readFile } from 'fs';
import { join } from 'path';
import { PathFull } from './types';


export interface Options {
  root?: string;
}

export interface File extends PathFull {
  content: string;
  root: string;
}

export function readfile(options: Options = {}) {
  const root = options.root || '';
  return function(path: string): Promise<File> {
    const abspath = join(root, path);
    return new Promise((resolve, reject) => {
      readFile(abspath, (err, res) => {
        if (err) reject(err);
        else resolve({ path, root, content: res.toString() });
      });
    });
  }
}
