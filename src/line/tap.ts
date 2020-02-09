import { transform, Transform, Function } from './transform';


export function tap<O>(func: Function<O, unknown>): Transform<O, O> {
  return transform((o: O) => { func(o); return o; })
}
