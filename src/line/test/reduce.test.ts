import { should, expect } from 'chai'; should();

import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { reduce } from '../reduce';
import { line } from '../line';

describe('reduce()', () => {
  it('should reduce contents of given line using given reducer.', done => {
    reduce((t, x: number) => t + x)(line([1, 2, 3, 4])).then(res => {
      res.should.equal(1 + 2 + 3 + 4);
      done();
    });
  });

  it('should work properly with async functions.', done => {
    reduce((t, x: number) => new Promise(r => setTimeout(() => r(t + x), 5)))
      (line([1, 2, 3, 4])).then(res => {
        res.should.equal(1 + 2 + 3 + 4);
        done();
      });
  });

  it('should work properly with observable functions.', done => {
    reduce((t, x: number) => of(t + x).pipe(delay(5)))
      (line([1, 2, 3, 4])).then(res => {
        res.should.equal(1 + 2 + 3 + 4);
        done();
      });
  });
});