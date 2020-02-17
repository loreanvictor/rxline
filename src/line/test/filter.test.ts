import { should, expect } from 'chai'; should();

import { filter } from '../filter';


describe('filter()', () => {
  it('should emit nothing if given value does not pass given (async) filter.', done => {
    filter<number>(x => new Promise(resolve => {
      setTimeout(() => resolve(x % 2 == 0), 10);
    }))
    .apply(3)
    .subscribe(() => { throw new Error('should not have happened.'); }, undefined, () => done());
  });

  it('should emit given value if it passes given (async) filter.', done => {
    filter<number>(x => new Promise(resolve => {
      setTimeout(() => resolve(x % 2 == 0), 10);
    }))
    .apply(4)
    .subscribe(() => done());
  });
});