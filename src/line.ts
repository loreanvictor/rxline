import { Observable, Observer, from, ReplaySubject } from 'rxjs';
import { flatMap, toArray, share } from 'rxjs/operators';

import { Transform, Function, identity } from './transform';
import { ProcessingStrategy, sequentially } from './process';


export type LineContent<I> = Observable<I> | Promise<I[]> | I[];
export type SimpleLine<I> = Line<I, I>;

export class Line<I, O> {
  readonly content$: Observable<I>;

  constructor(content: LineContent<I>, private transform: Transform<I, O>) {
    if (content instanceof Observable) this.content$ = content;
    else if (content instanceof Promise) this.content$ = from(content).pipe(flatMap(from));
    else this.content$ = from(content);
  }

  pipe<X>(funcOrTrans: Function<O, X> | Transform<O, X>): Line<I, X> {
    if (funcOrTrans instanceof Transform)
      return new Line(this.content$, this.transform.combine(funcOrTrans));
    else
      return new Line(this.content$, this.transform.combine(Transform.from(funcOrTrans)));
  }

  tap(func: Function<O, unknown>): Line<I, O> {
    return this.pipe((o: O) => { func(o); return o; });
  }

  groupBy(key: Function<O, {toString(): string}>): SimpleLine<SimpleLine<O>> {
    const _subjects = <{[key: string]: ReplaySubject<O>}>{};
    const obs$ = this.prep().content$.pipe(share());
    return new Line(Observable.create((observer: Observer<Line<O, O>>) => {
      obs$.subscribe({
        next: v => {
          const _key = key(v).toString();
          if (!(_key in _subjects)) {
            _subjects[_key] = new ReplaySubject<O>();
            
            observer.next(new Line(_subjects[_key], identity<O>()));
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
    }), identity<Line<O, O>>());
  }

  pick(func: Function<O, boolean>): Line<I, O> {
    return this.pipe(new Transform((o: O) => Observable.create((observer: Observer<O>) => {
      (async() => {
        try {
          if (await func(o)) observer.next(o);
          observer.complete();
        } catch(err) {
          observer.error(err);
        }
      })();
    })));
  }

  process(strategy: ProcessingStrategy<I, O> = sequentially): SimpleLine<O> {
    return new Line(new Promise((next, error) => {
      strategy(this.content$, this.transform).pipe(toArray()).subscribe({next, error});
    }), identity<O>());
  }

  prep(strategy: ProcessingStrategy<I, O> = sequentially): SimpleLine<O> {
    return new Line(strategy(this.content$, this.transform), identity<O>());
  }

  collect(collector: Function<O[], unknown>, strategy: ProcessingStrategy<I, O> = sequentially) {
    return this.prep(strategy).content$.pipe(toArray()).subscribe(collector);
  }
}


export function line<I>(content: LineContent<I>): SimpleLine<I> { return new Line<I, I>(content, identity<I>()); }
