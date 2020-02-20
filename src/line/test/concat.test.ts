import { should, expect } from 'chai'; should();

import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { concat } from '../concat';
import { line } from '../line';


describe('concat()', () => {
  it('should create a new line from contents of given lines, concating contents in given order.', done => {
    const l1 = line(of(1).pipe(delay(5)));
    const l2 = line(of(2));
    concat(l1, l2)
      .collect(r => {
        r.should.eql([1, 2]);
        done();
      });
  });
});