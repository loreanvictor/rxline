import { Function, transform } from '../line/transform';


export type FileFactory<I, T> = Function<I, { path: string, content: T, root?: string }>;

export function createFile<I, T>(factory: FileFactory<I, T>) {
  return transform(factory).combine(f => ({ ...f, root: f.root || '' }));
}
