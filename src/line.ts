import { Observable, Observer, Subscription, from } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Transform, TransFunc, identity } from './transform';
import { ProcessingStrategy, sequentially } from './process';


export type LineContent<I> = Observable<I> | Promise<I[]> | I[];


export class Line<I, O> {
  private content$: Observable<I>;

  constructor(content: LineContent<I>, private transform: Transform<I, O>) {
    if (content instanceof Observable) this.content$ = content;
    else if (content instanceof Promise) this.content$ = from(content).pipe(flatMap(from));
    else this.content$ = from(content);
  }

  pipe<X>(funcOrTrans: TransFunc<O, X> | Transform<O, X>): Line<I, X> {
    if (funcOrTrans instanceof Transform)
      return new Line(this.content$, this.transform.combine(funcOrTrans));
    else
      return new Line(this.content$, this.transform.combine(Transform.from(funcOrTrans)));
  }

  pick(func: TransFunc<O, boolean>): Line<I, O> {
    return this.pipe(new Transform((o: O) => Observable.create((observer: Observer<O>) => {
      (async() => {
        try {
          if (await func(o)) observer.next(o);
          observer.complete();
        } catch(err) {
          observer.error(err);
        }
      })().then();
    })));
  }

  process(strategy: ProcessingStrategy<I, O> = sequentially): Line<O, O> {
    return new Line(new Promise((next, error) => {
      strategy(this.content$, this.transform).subscribe({next, error});
    }), identity<O>());
  }
}


export function line<I>(content: LineContent<I>): Line<I, I> {
  return new Line<I, I>(content, identity<I>());
}
