import { Observable, Observer, ReplaySubject } from 'rxjs';
import { share } from 'rxjs/operators';

import { SimpleLine, Line, line } from './line';


export type KeyFunc<O> = (o: O) => {toString(): string};


//
// TODO: rewrite with groupBy
//
function _partition<O>(src: Line<unknown, O>, key: KeyFunc<O>) {
  const _subjects = <{[key: string]: ReplaySubject<O>}>{};
  const obs$ = src.prep().content$.pipe(share());
  return line<SimpleLine<O>>(Observable.create((observer: Observer<Line<O, O>>) => {
    obs$.subscribe({
      next: v => {
        const _key = key(v).toString();
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


export function partition<O>(key: KeyFunc<O>): (l: Line<unknown, O>) => SimpleLine<SimpleLine<O>>;
export function partition<O>(src: Line<any, O>, key: KeyFunc<O>): SimpleLine<SimpleLine<O>>;
export function partition<O>(srcOrKey: Line<unknown, O> | KeyFunc<O>, key?: KeyFunc<O>) {
  if (key) return _partition(srcOrKey as Line<unknown, O>, key);
  else return (l: Line<unknown, O>) => _partition(l, srcOrKey as KeyFunc<O>);
}