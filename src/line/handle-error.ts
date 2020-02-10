import { Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';

import { Transform } from './transform';
import { Modifier } from './modifier';


export type ErrorHandler<I> = (error: any, input: I, rethrow: (err: any) => void) => unknown;


export class HandleError<I, O> extends Modifier<O, O> {
  constructor(readonly handler: ErrorHandler<I>) {
    super(map(_ => _));
  }

  public modify<X>(transform: Transform<X, O>): Transform<X, O> {
    return new Transform(i => {
      const obs$ = transform.apply(i);
      return Observable.create((observer: Observer<O>) => {
        obs$.subscribe({
          next: i => observer.next(i),
          error: err => {
            this.handler(err, i as any, err => observer.error(err));
            observer.complete();
          },
          complete: () => observer.complete()
        });
      });
    });
  }
}


export function handleError<I, O>(handler: ErrorHandler<I>) { return new HandleError<I, O>(handler); }

