import { Observable, Observer, merge } from 'rxjs';
import { join } from 'path';
import { lstat, readdir } from 'fs';

import { line, SimpleLine } from '../line';

import { File, ScanOptions } from './types';


function _files$(path: string, options: ScanOptions, depth: number): Observable<File<undefined>> {
  options.recursive = options.recursive !== false;
  const abspath = options.root ? join(options.root, path) : path;

  return Observable.create((observer: Observer<File<undefined>>) => {
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
          observer.next({ path, root: options.root || '', content: undefined });
          observer.complete();
        }
      }
    });
  });
}


export function files$(path: string, options: ScanOptions = { recursive: true }): Observable<File<undefined>> {
  return _files$(path, options, 0);
}


export function files(path: string, options: ScanOptions = { recursive: true }): SimpleLine<File<undefined>> {
  return line(files$(path, options));
}
