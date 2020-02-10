import { OperatorFunction } from 'rxjs';

import { Transform } from './transform';


export class Modifier<I, O> {
  constructor(private op$: OperatorFunction<I, O>) {}

  public modify<X>(transform: Transform<X, I>): Transform<X, O> {
    return new Transform(i => transform.apply(i).pipe(this.op$));
  }
}


export function mod<I, O>(op$: OperatorFunction<I, O>) { return new Modifier(op$); }
