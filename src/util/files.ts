import { Observable, Observer, merge } from 'rxjs';
import { join } from 'path';
import { lstat, readdir } from 'fs';

import { line, SimpleLine } from '../line';


export interface Options {
  recursive?: boolean;
  root?: string;
}


export function files$(path: string, options: Options = { recursive: true }): Observable<string> {
  options.recursive = options.recursive !== false;
  const abspath = options.root ? join(options.root, path) : path;

  return Observable.create((observer: Observer<string>) => {
    lstat(abspath, (err, stats) => {
      if (err) observer.error(err);
      else {
        if (stats.isDirectory()) {
          readdir(abspath, (err, res) => {
            if (err) observer.error(err);
            else if (options.recursive) {
              merge(...res.map(name => files$(join(path, name), options))).subscribe(observer);
            }
            else {
              res.forEach(name => observer.next(join(path, name)));
              observer.complete();
            }
          });
        }
        else {
          observer.next(path);
          observer.complete();
        }
      }
    });
  });
}


export function files(path: string, options: Options = { recursive: true }): SimpleLine<string> {
  return line(files$(path, options));
}
