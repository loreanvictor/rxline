import { concat, Observable, Observer } from 'rxjs';

import { Line } from './line';
import { last } from 'rxjs/operators';


export type ReduceFunc<T, I> = (total: T, each: I) => T | Promise<T> | Observable<T>;


export function reduce<I>(func: ReduceFunc<number, I>): (l: Line<any, I>) => Promise<number>;
export function reduce<T, I>(func: ReduceFunc<T, I>, init: T): (l: Line<any, I>) => Promise<T>;
export function reduce<T, I>(func: ReduceFunc<T, I>, init: T = 0 as any): (l: Line<any, I>) => Promise<T> {
  return line => new Promise<T>((resolve, reject) => {
    line.collect(res => {
      let total = init;
      concat(...res.map(i => Observable.create((observer: Observer<T>) => {
        let _t = func(total, i);
        const _complete = (t: T) => { total = t; observer.complete(); }
        if (_t instanceof Observable) _t.pipe(last()).subscribe(_complete);
        else if (_t instanceof Promise) _t.then(_complete)
        else _complete(_t);
      }))).subscribe(undefined, err => reject(err), () => resolve(total));
    });
  });
}
