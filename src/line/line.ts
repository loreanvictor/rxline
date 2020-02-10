import { Observable, from } from 'rxjs';
import { flatMap, toArray } from 'rxjs/operators';

import { Modifier } from './modifier';
import { Transform, Function, identity } from './transform';
import { ProcessingStrategy, sequentially, concurrently } from './process';
import { tap } from './tap';
import { filter } from './filter';


export type LineContent<I> = Observable<I> | Promise<I[]> | I[];
export type SimpleLine<I> = Line<I, I>;

export class Line<I, O> {
  readonly content$: Observable<I>;

  constructor(content: LineContent<I>, private transform: Transform<I, O>) {
    if (content instanceof Observable) this.content$ = content;
    else if (content instanceof Promise) this.content$ = from(content).pipe(flatMap(from));
    else this.content$ = from(content);
  }

  pipe<X>(thing: Function<O, X> | Transform<O, X> | Modifier<I, O, I, X>): Line<I, X> {
    if (thing instanceof Transform)
      return new Line(this.content$, this.transform.combine(thing));
    else if (thing instanceof Modifier)
      return new Line(this.content$, thing.modify(this.transform));
    else
      return new Line(this.content$, this.transform.combine(Transform.from(thing)));
  }

  pick(func: Function<O, boolean>): Line<I, O> { return this.pipe(filter(func)); }
  drop(func: Function<O, boolean>): Line<I, O> { return this.pipe(filter(f => !func(f))); }
  peek(func: Function<O, unknown>): Line<I, O> { return this.pipe(tap(func)); }
  funnel<X, Y>(func: (l: Line<I, O>) => Line<X, Y>): Line<X, Y> { return func(this); }

  process(strategy: ProcessingStrategy<I, O> = sequentially): SimpleLine<O> {
    return new Line(new Promise((next, error) => {
      strategy(this.content$, this.transform).pipe(toArray()).subscribe({next, error});
    }), identity<O>());
  }

  prep(strategy: ProcessingStrategy<I, O> = sequentially): SimpleLine<O> {
    return new Line(strategy(this.content$, this.transform), identity<O>());
  }

  collect(collector: Function<O[], unknown>, strategy: ProcessingStrategy<I, O> = sequentially) {
    return this.prep(strategy).content$.pipe(toArray()).subscribe(collector);
  }
}


export function line<I>(content: LineContent<I>): SimpleLine<I> { return new Line<I, I>(content, identity<I>()); }
