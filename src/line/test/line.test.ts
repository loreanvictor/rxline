import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

import { line } from '../line';
import { pack } from '../reduce';


describe('Line', () => {
  it('should work (generally)', () => {
    // line(interval(100).pipe(take(14)))
    // .tap(console.log)
    // .pipe(x => ({ key: x % 5, x}))
    // .groupBy(x => x % 3)
    // .pipe(pack())
    // .pipe(reduce((x, i) => ({ x : x.x + 1, key : i.key }), { x: 0 }))
    // .collect(console.log);
  });
});