import { PathFull } from './types';


export function pathmatch(reg: RegExp) {
  return function(f: string | PathFull) {
    if (typeof f === 'string') return reg.test(f);
    else return reg.test(f.path);
  }
}
