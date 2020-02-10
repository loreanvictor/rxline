import { dirname, join } from 'path';
import { mkdir, exists } from 'fs';

import { PathFull, File, isFile } from './types';


function _ensurePath(path: string) {
  const dir = dirname(path);

  return new Promise((resolve, reject) => {
    exists(dir, async exists => {
      if (exists) resolve();
      else {
        if (dirname(dir) !== '.') await _ensurePath(dir);

        mkdir(dir, err => {
          if (err) reject(err);
          else resolve();
        });
      }
    });
  });
}


export function ensurePath(f: string | File<any> | PathFull) {
  if (typeof f === 'string') return _ensurePath(f);
  else if (isFile(f)) return _ensurePath(join(f.root, f.path));
  else return _ensurePath(f.path);
}
