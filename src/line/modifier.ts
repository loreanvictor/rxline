import { OperatorFunction } from 'rxjs';

import { Transform } from './transform';


export type ModifierFunc<A, B, C, D> = (t: Transform<A, B>) => Transform<C, D>;


export class Modifier<A, B, C, D> {
  constructor(private func: ModifierFunc<A, B, C, D>) {}

  public modify(transform: Transform<A, B>): Transform<C, D> {
    return this.func(transform);
  }
}


export interface LinearModifier<I, O> extends Modifier<any, I, any, O> {
  modify<X>(transform: Transform<X, I>): Transform<X, O>;
}


export function mod<A, B, C, D>(func: ModifierFunc<A, B, C, D>) { return new Modifier(func); }
export function mod$<I, O>(op$: OperatorFunction<I, O>): LinearModifier<I, O> { 
  return mod(t => new Transform(i => t.apply(i).pipe(op$))); 
}
