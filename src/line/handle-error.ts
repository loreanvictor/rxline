import { Observable, Observer } from 'rxjs';

import { Transform } from './transform';
import { mod, IdModVarOutput } from './modifier';


export type ErrorHandler<I> = (error: any, input: I, rethrow: (err: any) => void) => unknown;


export function handleError<I=any>(handler: ErrorHandler<I>) {
  return mod(function<O>(transform: Transform<I, O>) {
    return new Transform<I, O>(i => {
      const obs$ = transform.apply(i);
      return Observable.create((observer: Observer<O>) => {
        obs$.subscribe({
          next: i => observer.next(i),
          error: err => {
            handler(err, i as any, err => observer.error(err));
            observer.complete();
          },
          complete: () => observer.complete()
        });
      });
    });
  }) as IdModVarOutput<I>;
}
