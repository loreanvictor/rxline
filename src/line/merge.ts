import { merge as _merge } from 'rxjs';

import { line, Line } from './line';
import { concurrently } from './process';


export function merge<T>(...lines: Line<any, T>[]): Line<T, T> {
  return line(_merge(...lines.map(l => l.prep(concurrently).content$)));
}
