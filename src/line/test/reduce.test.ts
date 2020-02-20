import { should, expect } from 'chai'; should();

import { reduce } from '../reduce';
import { line } from '../line';

describe('reduce()', () => {
  it('should reduce contents of given line using given reducer.', done => {
    reduce((t, x: number) => t + x)(line([1, 2, 3, 4])).then(res => {
      res.should.equal(1 + 2 + 3 + 4);
      done();
    });
  });
});