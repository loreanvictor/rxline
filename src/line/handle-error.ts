import { Observable, Observer } from 'rxjs';

import { Transform } from './transform';
import { mod } from './modifier';


export type ErrorHandler<I> = (error: any, input: I, rethrow: (err: any) => void) => unknown;


export function handleError<I, O>(handler: ErrorHandler<I>) {
  return mod((transform: Transform<I, O>) => {
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
  });
}


