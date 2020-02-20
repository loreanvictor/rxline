import { concat as _concat } from 'rxjs';

import { line, Line } from './line';
import { sequentially } from './process';


export function concat<T>(...lines: Line<any, T>[]): Line<T, T> {
  return line(_concat(...lines.map(l => l.prep(sequentially).content$)));
}
