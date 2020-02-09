import { Observable } from 'rxjs';
import { mergeMap, concatMap } from 'rxjs/operators';

import { Transform } from './transform';


export type ProcessingStrategy<I, O> = (content$: Observable<I>, transform: Transform<I, O>) => Observable<O>;


export function sequentially<I, O>(content$: Observable<I>, transform: Transform<I, O>) {
  return content$.pipe(concatMap(transform.op$));
}

export function concurrently<I, O>(content$: Observable<I>, transform: Transform<I, O>) {
  return content$.pipe(mergeMap(transform.op$));
}
