import { Function } from './transform';


export function extend<O, E>(func: Function<O, E>): Function<O, O & E> {
  return async (o: O) => ({ ...o, ...await func(o)});
}
