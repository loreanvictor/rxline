import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

import { line } from '../line';
import { reduce } from '../reduce';


describe('line', () => {
  it('should work (generally)', () => {
    line(interval(100).pipe(take(14)))
    .tap(console.log)
    .pipe(x => ({ key: x % 5, x}))
    .groupBy(x => x.key)
    .pipe(reduce((x, i) => ({ x : x.x + 1, key : i.key }), { x: 0 }))
    .collect(console.log);
  });
});