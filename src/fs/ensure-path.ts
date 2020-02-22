import { dirname, join } from 'path';
import { mkdir, exists } from 'fs';

import { PathFull, File } from './types';


function _ensurePath(path: string): Promise<void> {
  const dir = dirname(path);

  return new Promise((resolve, reject) => {
    exists(dir, async exists => {
      if (exists) resolve();
      else {
        if (dirname(dir) !== '.') await _ensurePath(dir);

        mkdir(dir, err => {
          /* istanbul ignore if */
          if (err) reject(err);
          else resolve();
        });
      }
    });
  });
}


export function ensurePath(f: string | File<any> | PathFull) {
  if (typeof f === 'string') return _ensurePath(f);
  else return _ensurePath(join((f as any).root || '', f.path));
}
