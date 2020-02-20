import { Observable, Observer, ReplaySubject } from 'rxjs';
import { share } from 'rxjs/operators';

import { SimpleLine, Line, line } from './line';


export type KeyFunc<O, K extends keyof O> = (o: O) => O[K];


//
// TODO: rewrite with groupBy
//
function _partition<O, K extends keyof O>(src: Line<any, O>, key: KeyFunc<O, K>) {
  const _subjects = <{[key: string]: ReplaySubject<O>}>{};
  const obs$ = src.prep().content$.pipe(share());
  return line<SimpleLine<O>>(Observable.create((observer: Observer<Line<O, O>>) => {
    obs$.subscribe({
      next: v => {
        const _key = (key(v) as any).toString();
        if (!(_key in _subjects)) {
          _subjects[_key] = new ReplaySubject<O>();
          
          observer.next(line(_subjects[_key]));
        }

        _subjects[_key].next(v);
      },
      error: err => {
        observer.error(err);
        Object.values(_subjects).forEach(sub => sub.error(err));
      },
      complete: () => {
        observer.complete();
        Object.values(_subjects).forEach(sub => sub.complete());
      }
    })
  }));
}


export function partition<O, K extends keyof O>(key: KeyFunc<O, K>): (l: Line<any, O>) => SimpleLine<SimpleLine<O>>;
export function partition<O, K extends keyof O>(src: Line<any, O>, key: KeyFunc<O, K>): SimpleLine<SimpleLine<O>>;
export function partition<O, K extends keyof O>(srcOrKey: Line<any, O> | KeyFunc<O, K>, key?: KeyFunc<O, K>) {
  if (key) return _partition(srcOrKey as Line<unknown, O>, key);
  else return (l: Line<any, O>) => _partition(l, srcOrKey as KeyFunc<O, K>);
}