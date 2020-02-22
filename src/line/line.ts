import { Observable, from, Subscription } from 'rxjs';
import { flatMap, toArray } from 'rxjs/operators';

import { Modifier } from './modifier';
import { Transform, Function, identity } from './transform';
import { ProcessingStrategy, sequentially } from './process';
import { tap } from './tap';
import { filter } from './filter';


export type LineContent<I> = Observable<I> | Promise<I[]> | I[];
export type SimpleLine<I> = Line<I, I>;
export type Pipeable<I, O, X> = Function<O, X> | Transform<O, X> | Modifier<I, O, I, X>;


export class Line<I, O> {
  readonly content$: Observable<I>;

  constructor(content: LineContent<I>, private transform: Transform<I, O>) {
    if (content instanceof Observable) this.content$ = content;
    else if (content instanceof Promise) this.content$ = from(content).pipe(flatMap(from));
    else this.content$ = from(content);
  }

  pipe<X>(thing: Pipeable<I, O, X>): Line<I, X>;
  pipe<A, X>(a: Pipeable<I, O, A>, x: Pipeable<I, A, X>): Line<I, X>;
  pipe<A, B, X>(a: Pipeable<I, O, A>, b: Pipeable<I, A, B>, x: Pipeable<I, B, X>): Line<I, X>;
  pipe<A, B, C, X>(a: Pipeable<I, O, A>, b: Pipeable<I, A, B>, c: Pipeable<I, B, C>, x: Pipeable<I, C, X>): Line<I, X>;
  pipe<A, B, C, D, X>(a: Pipeable<I, O, A>, b: Pipeable<I, A, B>, c: Pipeable<I, B, C>, d: Pipeable<I, C, D>, x: Pipeable<I, D, X>): Line<I, X>;
  pipe<A, B, C, D, E, X>(a: Pipeable<I, O, A>, b: Pipeable<I, A, B>, c: Pipeable<I, B, C>, d: Pipeable<I, C, D>, e: Pipeable<I, D, E>, x: Pipeable<I, E, X>): Line<I, X>;
  pipe<A, B, C, D, E, F, X>(a: Pipeable<I, O, A>, b: Pipeable<I, A, B>, c: Pipeable<I, B, C>, d: Pipeable<I, C, D>, e: Pipeable<I, D, E>, f: Pipeable<I, E, F>, x: Pipeable<I, F, X>): Line<I, X>;
  pipe<A, B, C, D, E, F, G, X>(a: Pipeable<I, O, A>, b: Pipeable<I, A, B>, c: Pipeable<I, B, C>, d: Pipeable<I, C, D>, e: Pipeable<I, D, E>, f: Pipeable<I, E, F>, g: Pipeable<I, F, G>, x: Pipeable<I, G, X>): Line<I, X>;
  pipe<A, B, C, D, E, F, G, H, X>(a: Pipeable<I, O, A>, b: Pipeable<I, A, B>, c: Pipeable<I, B, C>, d: Pipeable<I, C, D>, e: Pipeable<I, D, E>, f: Pipeable<I, E, F>, g: Pipeable<I, F, G>, h: Pipeable<I, G, H>, x: Pipeable<I, H, X>): Line<I, X>;
  pipe<A, B, C, D, E, F, G, H, J, X>(a: Pipeable<I, O, A>, b: Pipeable<I, A, B>, c: Pipeable<I, B, C>, d: Pipeable<I, C, D>, e: Pipeable<I, D, E>, f: Pipeable<I, E, F>, g: Pipeable<I, F, G>, h: Pipeable<I, G, H>, i: Pipeable<I, H, J>, x: Pipeable<I, J, X>): Line<I, X>;
  pipe(...pipes: Pipeable<I, any, any>[]) {
    return pipes.reduce((line, pipe) => line._pipe(pipe), this as Line<I, any>);
  }

  private _pipe<X>(thing: Pipeable<I, O, X>): Line<I, X> {
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
