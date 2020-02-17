import { Observable, Observer } from 'rxjs';
import { share } from 'rxjs/operators';

import { Function, Function$ } from '../line/transform';

import { File } from './types';


export type FileFactory<I, T> = Function<I, { path: string, content: T }>;

export function createFile<I, T>(factory: FileFactory<I, T>) {
  return async function(i: I): Promise<File<T>> {
    let f = await factory(i);
    return { ...f, root: (f as any).root || '' };
  }
}


export type MutliFileFactory<I, T> = (i: I, 
    emit: (path: string, content: T) => void, 
    done: () => void,
    error: (err: any) => void) => any;

export function createFiles<I, T>(factory: MutliFileFactory<I, T>): Function$<I, File<T>> {
  return function(i: I) {
    return new Observable((observer: Observer<File<T>>) => {
      factory(i, 
        (path, content) => observer.next({ path, content, root: '' }),
        () => observer.complete(),
        err => observer.error(err)
      );
    }).pipe(share());
  }
}
