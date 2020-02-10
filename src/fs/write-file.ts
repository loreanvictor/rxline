import { writeFile as writef } from 'fs';
import { join } from 'path';

import { ensurePath } from './ensure-path';
import { File } from './types';


export interface Options {
  root?: string;
}


export function writeFile(options: Options = {}) {
  const _root = options.root || '';
  return async function(f: File<string>): Promise<File<string>> {
    const path = f.path; 
    const root = _root || f.root;
    const abspath = join(root, path);

    await ensurePath(abspath);
    return new Promise((resolve, reject) => {
      writef(abspath, f.content, err => {
        if (err) reject(err);
        else resolve(f);
      })
    });
  }
}
