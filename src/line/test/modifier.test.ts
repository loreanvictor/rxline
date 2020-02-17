import { should, expect } from 'chai'; should();

import { Modifier, mod, mod$ } from '../modifier';
import { transform } from '../transform';
import { map } from 'rxjs/operators';


describe('modifier', () => {
  describe('Modifier', () => {
    describe('.modify()', () => {
      it('should modify the given Transform using given function.', () => {
        const T1 = transform(x => x);
        const T2 = transform(() => 5);
        new Modifier(t => {
          t.should.equal(T1);
          return T2;
        }).modify(T1).should.equal(T2);
      });
    });
  });
  
  describe('mod()', () => {
    it('should create a Modifier modifying given transforms using given function.', () => {
      const T1 = transform(x => x);
      const T2 = transform(() => 5);
      mod(t => {
        t.should.equal(T1);
        return T2;
      }).modify(T1).should.equal(T2);
    });
  });
  
  describe('mod$()', () => {
    it('should create a Modifier piping given rxjs operator on given Transform\'s observable results.', done => {
      const T1 = transform((x: number) => x * 2);
      mod$(map((x:number) => `# ${x}`)).modify(T1).apply(17).subscribe(res => {
        res.should.equal('# 34');
        done();
      });
    });
  });
});