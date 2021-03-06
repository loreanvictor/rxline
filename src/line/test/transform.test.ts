import { should, expect } from 'chai'; should();

import { Transform, identity, transform } from '../transform';
import { of, from, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';


describe('transform', () => {
  describe('Transform', () => {
    describe('.apply()', () => {
      it('should pass given input to factory it was constructed with.', () => {
        const input = {};
  
        new Transform((i: any) => {
          i.should.equal(input);
          return undefined as any;
        }).apply(input);
      });
  
      it('should return the observable created by the factory it was constructed with.', () => {
        const obs$ = Observable.create();
        new Transform(() => obs$).apply(undefined).should.equal(obs$);
      });
    });
  
    describe('.combine()', () => {
      it('should return a combined transform applying factory of given transform on outputs of itself.', done => {
        new Transform((i: number) => of(i * 2))
        .combine(new Transform(i => of(i + 3)))
        .apply(5)
        .subscribe(res => {
          res.should.equal(13);
          done();
        });
      });
  
      it('should feed all of the emissions of its own result observable to combined transform.', done => {
        let r = <number[]>[];
  
        new Transform((i: number) => from([i * 2, i * 3, i * 4]))
        .combine(new Transform(i => of(i + 3)))
        .apply(10)
        .subscribe(res => r.push(res), undefined, () => {
          r.length.should.equal(3);
          r.should.have.members([43, 33, 23]);
          done();
        });
      });

      it('should also work with given function.', done => {
        new Transform((i: number) => i * 2)
        .combine(i => i + 3)
        .apply(42)
        .subscribe(n => {
          n.should.equal(42 * 2 + 3);
          done();
        });
      });
    });
  });
  
  describe('identity()', () => {
    it('should return an identity Transform.', done => {
      let I = identity<string>();
      I.should.be.instanceOf(Transform);
      I.apply('hellow').subscribe(res => {
        res.should.equal('hellow');
        done();
      });
    });
  });
  
  describe('transform()', () => {
    it('should create a Transform applying given sync function.', done => {
      const T = transform((x: number) => x * 42);
      T.should.be.instanceOf(Transform);
      T.apply(3).subscribe(res => {
        res.should.equal(42 * 3);
        done();
      });
    });
  
    it('should create a Transform applying given async function.', done => {
      const T = transform((x: number) => new Promise<number>(resolve => setTimeout(() => resolve(x * 42), 10)));
      T.should.be.instanceOf(Transform);
      T.apply(5).subscribe(res => {
          res.should.equal(42 * 5);
          done();
        });
    });

    it('should create a Transform applying given observable function.', done => {
      const T = transform((x: number) => of(x).pipe(delay(5)));
      T.should.be.instanceOf(Transform);
      T.apply(5).subscribe((res: number) => {
        res.should.equal(5);
        done();
      });
    });
  });
});
