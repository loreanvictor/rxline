import { parse, join } from 'path';

import { PathFull, FileModificationOptions, File } from './types';
import { mapPath } from './map-file';


export function _dropExt(path: string) {
  const { dir, name } = parse(path);
  return join(dir, name);
}


export function dropExt<I>(options?: FileModificationOptions) {
  return function(f: File<I> | PathFull) {
    return mapPath<I>(_dropExt, options)(f);
  }
}


export type ExtensionMapper<I> = (ext: string, path: string, 
                                root: string, content: I) => string | Promise<string>;

export function mapExt<I>(map: ExtensionMapper<I>, options?: FileModificationOptions) {
  async function _<T extends PathFull>(f: T | File<I>) {
    const corrected = (ext: string) => ext.startsWith('.') ? ext : '.' + ext;
    const ext = (path: string) => { const { ext } = parse(path); return ext; };

    return mapPath<I>(
      async (path, root, content) => _dropExt(path) + corrected(await map(ext(path), path, root, content)),
      options
    )(f);
  }

  return _;
}
