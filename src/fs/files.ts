import { Observable, Observer, merge } from 'rxjs';
import { join } from 'path';
import { lstat, readdir } from 'fs';

import { line, SimpleLine } from '../line';


export interface Options {
  recursive?: boolean;
  root?: string;
}

function _files$(path: string, options: Options, depth: number): Observable<string> {
  options.recursive = options.recursive !== false;
  const abspath = options.root ? join(options.root, path) : path;

  return Observable.create((observer: Observer<string>) => {
    lstat(abspath, (err, stats) => {
      if (err) observer.error(err);
      else {
        if (stats.isDirectory()) {
          if (options.recursive || depth === 0) {
            readdir(abspath, (err, res) => {
              if (err) observer.error(err);
              else merge(...res.map(name => _files$(join(path, name), options, depth + 1))).subscribe(observer);
            });
          }
          else observer.complete();
        }
        else {
          observer.next(path);
          observer.complete();
        }
      }
    });
  });
}


export function files$(path: string, options: Options = { recursive: true }): Observable<string> {
  return _files$(path, options, 0);
}


export function files(path: string, options: Options = { recursive: true }): SimpleLine<string> {
  return line(files$(path, options));
}
