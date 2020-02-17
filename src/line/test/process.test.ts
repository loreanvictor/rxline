import { should, expect } from 'chai'; should();

import { from, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { sequentially, concurrently } from '../process';
import { transform$ } from '../transform';


describe('process', () => {
  describe('sequentially()', () => {
    it('should apply given transform on objects emitted by given observable sequentially.', done => {
      let r = <number[]>[];
      sequentially(
        from([1, 2, 3, 4]), 
        transform$(i => of(i).pipe(delay(10 - i * 2)))
      ).subscribe(_ => r.push(_), undefined, () => {
        r.should.eql([1, 2, 3, 4]);
        done();
      });
    });
  });

  describe('concurrently()', () => {
    it('should apply given transform on objects emitted by given observable concurrently.', done => {
      let r = <number[]>[];
      concurrently(
        from([1, 2, 3, 4]), 
        transform$(i => of(i).pipe(delay(10 - i * 2)))
      ).subscribe(_ => r.push(_), undefined, () => {
        r.should.eql([4, 3, 2, 1]);
        done();
      });
    });
  });
});