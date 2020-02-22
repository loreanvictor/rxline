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

export function mapContent<I=string, O=string>(map: ContentMapper<I, O>, options?: FileModificationOptions):
  (f: File<I>) => Promise<File<O>> {
  return async function(f: File<I>) {
    return _map(f, 'content', await map(f.content, f.path, f.root), options) as File<O>;
  }
}


export type PathMapper<I> = (path: string, root: string, content: I) => string | Promise<string>;

export function mapPath<I>(map: PathMapper<I>, options?: FileModificationOptions) {
  return async function<T extends PathFull>(f: T | File<I>) {
    return _map(f, 'path', await map(f.path, (f as File<I>).root, (f as File<I>).content), options) as File<I>;
  }
}


export type RootMapper<I> = <I>(root: string, path: string, content: I) => string | Promise<string>;

export function mapRoot<I>(map: RootMapper<I>, options?: FileModificationOptions) {
  return async function(f: File<I>) {
    return _map(f, 'root', await map(f.root, f.path, f.content), options) as File<I>;
  }
}
