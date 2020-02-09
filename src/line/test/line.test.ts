import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

import { line } from '../line';
import { partition } from '../partition';
import { reduce } from '../reduce';


describe('Line', () => {
  line(interval(50).pipe(take(23)))
  .pick(x => x > 10)
  .peek(console.log)
  .funnel(partition(x => x % 3))
  .pipe(reduce(c => ++c))
  .collect(console.log);
});