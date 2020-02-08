import { Function } from './transform';
import { Line } from './line';


export function reduce<I>(func: (total: number, each: I) => number): Function<Line<any, I>, number>;
export function reduce<T, I>(func: (total: T, each: I) => T, init: T): Function<Line<any, I>, number>;
export function reduce<T, I>(func: (total: T, each: I) => T, init: T = 0 as any):
  Function<Line<any, I>, T> {
  return line => new Promise<T>(resolve => {
    line.collect(res => resolve(res.reduce(func, init)));
  });
}
