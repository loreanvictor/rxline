import { Observable, Observer } from 'rxjs';

import { transform, Transform, Function } from './transform';


export function filter<O>(func: Function<O, boolean>): Transform<O, O> {
  return transform((o: O) => Observable.create((observer: Observer<O>) => {
    (async() => {
      try {
        if (await func(o)) observer.next(o);
        observer.complete();
      } catch(err) {
        observer.error(err);
      }
    })();
  }));
}
