import { parse, join } from 'path';

import { PathFull, FileModificationOptions } from './types';
import { mapPath } from './map-file';


export function _dropExt(path: string) {
  const { dir, name } = parse(path);
  return join(dir, name);
}


export function dropExt(options?: FileModificationOptions): <T extends PathFull>(t: T) => Promise<T>;
export function dropExt<S extends string>(): (s: string) => string;
export function dropExt(options?: FileModificationOptions): 
  ((s: string) => string) | (<T extends PathFull>(t: T) => Promise<T>) {
  function _<T extends PathFull>(f: T): Promise<T>;
  function _<T extends PathFull>(f: string): string;
  function _<T extends PathFull>(f: string | T) {
    if (typeof f === 'string') return _dropExt(f);
    else return mapPath<T>(_dropExt, options)(f);
  }

  return _;
}


export type ExtensionMapper = (ext: string, path: string, 
                                root: string, content: string) => string | Promise<string>;

export function mapExt(map: ExtensionMapper, options?: FileModificationOptions): 
<T extends PathFull>(t: T) => Promise<T>;
export function mapExt<S extends string>(map: (e: string, s: string) => string): (s: string) => Promise<string>;
export function mapExt(
  map: ExtensionMapper | ((e: string, s: string) => string),
  options?: FileModificationOptions
) {
  async function _<T extends PathFull>(f: T): Promise<T>;
  async function _<T extends PathFull>(f: string): Promise<string>;
  async function _<T extends PathFull>(f: string | T) {
    const corrected = (ext: string) => ext.startsWith('.') ? ext : '.' + ext;
    const ext = (path: string) => { const { ext } = parse(path); return ext; };

    if (typeof f === 'string') return _dropExt(f) + corrected(await map(ext(f), f, '', ''));
    else return mapPath<T>(
      async (path, root, content) => _dropExt(path) + corrected(await map(ext(path), path, root, content)),
      options
    )(f);
  }

  return _;
}
