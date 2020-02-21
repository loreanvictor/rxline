import { Observable, from, of, throwError } from 'rxjs';
import { concatMap } from 'rxjs/operators';


export type Function<I, O> = (i: I) => O | Promise<O> | Observable<O>;
export type Function$<I, O> = (i: I) => Observable<O>;


export class Transform<I, O> {
  readonly op$: Function$<I, O>;

  constructor(_op$: Function<I, O>) { 
    this.op$ = i => {
      try {
        const _o = _op$(i);
        if (_o instanceof Promise) return from(_o);
        else if (_o instanceof Observable) return _o;
        else return of(_o);
      } catch(err) {
        return throwError(err);
      }
    };
  }

  combine<X>(transform: Transform<O, X>): Transform<I, X> {
    // if (transform instanceof Transform)
      return new Transform((i: I) => this.op$(i).pipe(concatMap(transform.op$)));
    // else return this.combine(new Transform<O, X>(transform));
  }

  apply(i: I) { return this.op$(i); }
}


export function identity<I>() { return new Transform((i: I) => i); }
export function transform<I, O>(func: Function<I, O>) { return new Transform(func); }
