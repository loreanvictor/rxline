import { PathFull } from "./types";


export function withoutExtension(path: string) {
  const split = path.split('.');
  if (split.length > 1) return split.slice(0, -1).join('.');
  else return path;
}

export function dropExtension() {
  return function(f: string | PathFull) {
    if (typeof f === 'string') return withoutExtension(f);
    else return { ...f, path: withoutExtension(f.path) };
  }
}
