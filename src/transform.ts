import { Observable, Observer } from 'rxjs';
import { concatMap } from 'rxjs/operators';


export type TransFunc<I, O> = (i: I) => O | Promise<O>;
export type TransFunc$<I, O> = (i: I) => Observable<O>;


export class Transform<I, O> {
  public static from<I, O>(func: TransFunc<I, O>): Transform<I, O> {
    return new Transform((i: I) => Observable.create((observer: Observer<O>) => {
      (async() => {
        try {
          observer.next(await func(i));
          observer.complete();
        } catch(err) {
          observer.error(err);
        }
      })().then();
    }))
  }

  constructor(readonly op$: TransFunc$<I, O>) { }

  combine<X>(transform: Transform<O, X>): Transform<I, X> {
    return new Transform((i: I) => this.op$(i).pipe(concatMap(transform.op$)));
  }

  apply(i: I) { return this.op$(i); }
}


export function identity<I>(){ return Transform.from((i: I) => i); }
