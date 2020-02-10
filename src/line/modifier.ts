import { OperatorFunction } from 'rxjs';

import { Transform } from './transform';


export type ModifierFunc<A, B, C, D> = (t: Transform<A, B>) => Transform<C, D>;


export class Modifier<A, B, C, D> {
  constructor(private func: ModifierFunc<A, B, C, D>) {}

  public modify(transform: Transform<A, B>): Transform<C, D> {
    return this.func(transform);
  }
}


export function mod<A, B, C, D>(func: ModifierFunc<A, B, C, D>) { return new Modifier(func); }
export function mod$<X, I, O>(op$: OperatorFunction<I, O>): Modifier<X, I, X, O> { 
  return mod(t => new Transform(i => t.apply(i).pipe(op$))); 
}
