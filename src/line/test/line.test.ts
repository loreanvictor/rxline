import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

import { line } from '../line';
import { concurrently, sequentially } from '../process';
import { partition } from '../partition';
import { reduce } from '../reduce';

import { handleError } from '../handle-error';


describe.only('Line', () => {
  it('should do shit', () => {
    line(interval(10).pipe(take(23)))
    .pick(x => x > 10)
    .pipe(x => {
      if (x == 13) throw new Error('JINX!');
      return x;
    })
    .pipe(x => new Promise<number>((resolve) => setTimeout(() => resolve(x), 1000 - x * 25)))
    .peek(console.log)
    .pipe(handleError((_, num) => console.log('OOPS:: ' + num)))
    // .funnel(partition(x => x % 3))
    // .pipe(reduce(c => ++c))
    .prep(concurrently)
    .collect(console.log)
  });
});