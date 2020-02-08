import { Observable } from 'rxjs';
import { mergeMap, concatMap, toArray } from 'rxjs/operators';

import { Transform } from './transform';


export type ProcessingStrategy<I, O> = (content$: Observable<I>, transform: Transform<I, O>) => Observable<O[]>;


export function sequentially<I, O>(content$: Observable<I>, transform: Transform<I, O>) {
  return content$.pipe(concatMap(transform.op$), toArray());
}

export function concurrently<I, O>(content$: Observable<I>, transform: Transform<I, O>) {
  return content$.pipe(mergeMap(transform.op$), toArray());
}
