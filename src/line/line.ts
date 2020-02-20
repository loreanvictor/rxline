import { Observable, from, Subscription } from 'rxjs';
import { flatMap, toArray } from 'rxjs/operators';

import { Modifier } from './modifier';
import { Transform, Function, identity } from './transform';
import { ProcessingStrategy, sequentially } from './process';
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
      return new Line(this.content$, this.transform.combine(new Transform(thing)));
  }

  pick(func: Function<O, boolean>): Line<I, O> { return this.pipe(filter(func)); }
  drop(func: Function<O, boolean>): Line<I, O> { return this.pipe(filter(async f => !await func(f))); }
  peek(func: Function<O, unknown>): Line<I, O> { return this.pipe(tap(func)); }
  funnel<T>(func: (l: Line<I, O>) => T): T { return func(this); }

  process(strategy: ProcessingStrategy<I, O> = sequentially): SimpleLine<O> {
    return new Line(new Promise((next, error) => {
      strategy(this.content$, this.transform).pipe(toArray()).subscribe({next, error});
    }), identity<O>());
  }

  prep(strategy: ProcessingStrategy<I, O> = sequentially): SimpleLine<O> {
    return new Line(strategy(this.content$, this.transform), identity<O>());
  }

  collect(collector: Function<O[], unknown>): Subscription;
  collect(strategy: ProcessingStrategy<I, O>, collector: Function<O[], unknown>): Subscription;
  collect(collectorOrStrategy: Function<O[], unknown> | ProcessingStrategy<I, O>, 
          collector?: Function<O[], unknown>) {
    const strategy = collector ? collectorOrStrategy as ProcessingStrategy<I, O> : sequentially;
    return this.prep(strategy).content$
      .pipe(toArray())
      .subscribe(collector || (collectorOrStrategy as Function<O[], unknown>));
  }
}


export function line<I>(content: LineContent<I>): SimpleLine<I> { return new Line<I, I>(content, identity<I>()); }
