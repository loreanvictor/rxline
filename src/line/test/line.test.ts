import { Observable, of } from 'rxjs';
import { toArray, delay } from 'rxjs/operators';

import { line, Line } from '../line';
import { transform } from '../transform';
import { mod } from '../modifier';
import { concurrently } from '../process';


describe('line()', () => {
  it('should create a `Line` instance.', () => {
    line([]).should.be.instanceOf(Line);
  })

  it('should properly construct a line from an observable.', () => {
    const o$ = Observable.create();
    line(o$).content$.should.equal(o$);
  });

  it('should properly construct a line from a promise.', done => {
    const r = <number[]>[];
    line((async() => [1, 2, 3, 4])()).content$.subscribe(i => r.push(i), undefined, () => {
      r.should.eql([1, 2, 3, 4]);
      done();
    });
  });

  it('should properly construct a line from an array.', done => {
    const r = <number[]>[];
    line([1, 2, 3, 4]).content$.subscribe(i => r.push(i), undefined, () => {
      r.should.eql([1, 2, 3, 4]);
      done();
    });
  });

  describe('.pipe()', () => {
    it('should apply given transformation to line content upon collection.', done => {
      line([1, 2, 3, 4]).pipe(transform(x => x * 2)).collect(r => {
        r.should.eql([2, 4, 6, 8]);
        done();
      });
    });

    it('should combine subsequent transformations.', done => {
      line([1, 2, 3, 4])
        .pipe(transform(x => x * 2))
        .pipe(transform(x => x + 1))
        .collect(r => {
          r.should.eql([3, 5, 7, 9]);
          done();
        });
    });

    it('should apply given modifier on previous transformations.', done => {
      line([1, 2, 3, 4])
        .pipe(transform(x => x * 2))
        .pipe(mod(() => transform(() => 'A')))
        .collect(r => {
          r.should.eql(['A', 'A', 'A', 'A']);
          done();
        });
    });

    it('should wrap functions in transforms and pipe them.', done => {
      line([1, 2, 3, 4])
        .pipe(x => new Promise<number>(res => setTimeout(() => res(x * 2), 2)))
        .pipe(x => x - 1)
        .collect(r => {
          r.should.eql([1, 3, 5, 7]);
          done();
        });
    });

    it('should return another line with same content.', () => {
      const l = line([1, 2, 3, 4]);
      const l2 = l.pipe(x => x * 2);
      l2.should.not.equal(l);
      l2.should.be.instanceOf(Line);
      l2.content$.should.equal(l.content$);
    });
  });

  describe('.pick()', () => {
    it('should only pick items matching given predicates upon collection.', done => {
      line([1, 2, 3, 4])
        .pick(x => x > 1)
        .pick(x => new Promise(res => setTimeout(() => res(x > 2), 10)))
        .collect(r => {
          r.should.eql([3, 4]);
          done();
        });
    });

    it('should return a new line with same content.', () => {
      const l = line([1, 2, 3, 4]);
      const l2 = l.pick(x => x > 2);
      l2.should.not.equal(l);
      l2.should.be.instanceOf(Line);
      l2.content$.should.equal(l.content$);
    });
  });

  describe('.drop()', () => {
    it('should drop items matching given predicates upon collection.', done => {
      line([1, 2, 3, 4])
        .drop(x => x > 3)
        .drop(x => new Promise(res => setTimeout(() => res(x > 2), 10)))
        .collect(r => {
          r.should.eql([1, 2]);
          done();
        });
    });

    it('should return a new line with same content.', () => {
      const l = line([1, 2, 3, 4]);
      const l2 = l.drop(x => x > 2);
      l2.should.not.equal(l);
      l2.should.be.instanceOf(Line);
      l2.content$.should.equal(l.content$);
    });
  });

  describe('.peek()', () => {
    it('should allow tapping into items before (next) transformation.', done => {
      const r = <number[]>[];
      line([1, 2, 3, 4])
        .peek(x => r.push(x))
        .pipe(x => x * 2)
        .collect(() => {
          r.should.eql([1, 2, 3, 4]);
          done();
        });
    });

    it('should return a new line with same content.', () => {
      const l = line([1, 2, 3, 4]);
      const l2 = l.peek(x => x);
      l2.should.not.equal(l);
      l2.should.be.instanceOf(Line);
      l2.content$.should.equal(l.content$);
    });
  });

  describe('.funnel()', () => {
    it('should apply the given function on line and return the result.', () => {
      const l = line([]);
      l.funnel(_l => {
        _l.should.equal(l);
        return 42;
      }).should.equal(42);
    });
  });

  describe('.process()', () => {
    it('should return a new line whose content is the content of this line passed through its transform.', done => {
      const l1 = line([1, 2, 3, 4]);
      const l2 = l1
        .pick(x => x % 2 == 0)
        .pipe(x => x * 10 + 1)
        .process();

      l2.should.be.instanceOf(Line);
      l2.should.not.equal(l1);
      l2.content$.pipe(toArray()).subscribe(r => {
        r.should.eql([21, 41]);
        done();
      });
    });

    it('should cause an eager application of transform on line content.', done => {
      let _Flag = false;

      line([1])
      .peek(() => _Flag = true)
      .process();

      setImmediate(() => {
        _Flag.should.be.true;
        done();
      });
    });

    it('should use given processing strategy to transform line contents.', done => {
      const l = line([1, 2, 3, 4]).pipe(x => x * 3);

      l.process((ob$, t$) => {
        ob$.should.equal(l.content$);
        t$.apply(2).subscribe(x => x.should.equal(6), undefined, () => done());
        return ob$;
      });
    });
  });

  describe('.prep()', () => {
    it('should return a new line whose content is the content of this line passed through its transform.', done => {
      const l1 = line([1, 2, 3, 4]);
      const l2 = l1
        .pick(x => x % 2 == 0)
        .pipe(x => x * 10 + 1)
        .prep();

      l2.should.be.instanceOf(Line);
      l2.should.not.equal(l1);
      l2.content$.pipe(toArray()).subscribe(r => {
        r.should.eql([21, 41]);
        done();
      });
    });

    it('should cause an lazy application of transform on line content.', done => {
      let _Flag = false;

      const l = line([1])
      .peek(() => _Flag = true)
      .prep();

      setImmediate(() => {
        _Flag.should.be.false;
        l.collect(() => {
          _Flag.should.be.true;
          done();
        })
      });
    });

    it('should use given processing strategy to transform line contents.', done => {
      const l = line([1, 2, 3, 4]).pipe(x => x * 3);

      l.prep((ob$, t$) => {
        ob$.should.equal(l.content$);
        t$.apply(2).subscribe(x => x.should.equal(6), undefined, () => done());
        return ob$;
      });
    });
  });

  describe('.collect()', () => {
    it('should return the transform content of the line as an array.', done => {
      line([1, 2, 3, 4]).pipe(x => x * 2).drop(x => x == 4).collect(r => {
        r.should.eql([2, 6, 8]);
        done();
      });
    });

    it('should use given processing strategy to apply the transformation.', done => {
      line([1, 2, 3, 4])
        .pipe(i => of(i).pipe(delay(20 - i * 5)))
        .pipe(x => x * 3)
        .drop(x => x == 6)
        .collect(concurrently, r => {
          r.should.eql([12, 9, 3]);
          done();
        });
    });
  });
});