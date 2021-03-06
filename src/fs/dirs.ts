import { Observable, Observer, merge } from 'rxjs';
import { join } from 'path';
import { lstat, readdir } from 'fs';

import { line, SimpleLine } from '../line';
import { ScanOptions } from './types';


function _dirs$(path: string, options: ScanOptions, depth: number): Observable<string> {
  options.recursive = options.recursive !== false;
  const abspath = options.root ? join(options.root, path) : path;
  return Observable.create((observer: Observer<string>) => {
    lstat(abspath, (err, stats) => {
      if (err) observer.error(err);
      else {
        if (stats.isDirectory()) {
          if (options.recursive || depth === 0) {
            if (depth !== 0) observer.next(path);

            readdir(abspath, (err, res) => {
              /* istanbul ignore if */
              if (err) observer.error(err);
              else merge(...res.map(name => _dirs$(join(path, name), options, depth + 1))).subscribe(observer);
            });
          }
          else {
            observer.next(path);
            observer.complete();
          }
        }
        else observer.complete();
      }
    })
  });
}

export function dirs$(path: string, options: ScanOptions = { recursive: true }): Observable<string> {
  return _dirs$(path, options, 0);
}


export function dirs(path: string, options: ScanOptions = { recursive: true }): SimpleLine<string> {
  return line(dirs$(path, options));
}
