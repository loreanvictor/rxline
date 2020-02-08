import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

import { line } from '../line';


describe('line', () => {
  it('should work (generally)', () => {
    line(interval(1000).pipe(take(10)))
    .pipe(x => x * 2)
    .tap(console.log)
    .process()
    .pick(x => x > 5)
    .pipe(x => `--> ${x}`)
    .tap(console.log)
    .process();
  });
});