import { Observable, Observer } from 'rxjs';
import { concatMap } from 'rxjs/operators';


export type Function<I, O> = (i: I) => O | Promise<O>;
export type Function$<I, O> = (i: I) => Observable<O>;


export class Transform<I, O> {
  public static from<I, O>(func: Function<I, O>): Transform<I, O> {
    return new Transform((i: I) => Observable.create((observer: Observer<O>) => {
      (async() => {
        try {
          observer.next(await func(i));
          observer.complete();
        } catch(err) {
          observer.error(err);
        }
      })();
    }))
  }

  constructor(readonly op$: Function$<I, O>) { }

  combine<X>(transform: Transform<O, X>): Transform<I, X> {
    return new Transform((i: I) => this.op$(i).pipe(concatMap(transform.op$)));
  }

  apply(i: I) { return this.op$(i); }
}


export function identity<I>() { return Transform.from((i: I) => i); }
export function transform<I, O>(func: Function<I, O>) { return Transform.from(func); }
export function transform$<I, O>(func$: Function$<I, O>) { return new Transform(func$); }
