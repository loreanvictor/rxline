import { Function } from '../line/transform';

import { PathFull, File, FileModificationOptions } from './types';


function _map<F, K extends keyof F, V>(f: F, key: K, value: V, 
    opts: FileModificationOptions = { overwrite: false }) {
  if (opts.overwrite) {
    f[key] = value as any;
    return f as any;
  }
  else return { ...f, [key]: value } as any;
}


export type ContentMapper<I, O> = (content: I, path: string, root: string) => O | Promise<O>;

export function mapContent<I, O>(map: ContentMapper<I, O>, options?: FileModificationOptions):
  Function<File<I>, File<O>> {
  return async function(f: File<I>) {
    return _map(f, 'content', await map(f.content, f.path, f.root), options) as File<O>;
  }
}


export type PathMapper = (path: string, root: string, content: string) => string | Promise<string>;

export function mapPath<T extends PathFull>(map: PathMapper, options?: FileModificationOptions) {
  return async function(f: T | File<any>) {
    return _map(f, 'path', await map(f.path, (f as File<any>).root, (f as File<any>).content), options);
  }
}


export type RootMapper = (root: string, path: string, content: string) => string | Promise<string>;

export function mapRoot(map: RootMapper, options?: FileModificationOptions) {
  return async function(f: File<any>) {
    return _map(f, 'root', await map(f.root, f.path, f.content), options);
  }
}
