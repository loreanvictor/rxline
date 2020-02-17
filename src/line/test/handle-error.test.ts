import { should, expect } from 'chai'; should();

import { handleError } from '../handle-error';
import { transform } from '../transform';


describe('handleError()', () => {
  it('should allow gracefully handling errors occurring in a Transform.', done => {
    let handled = false;
    const err = Error();
    handleError(e =>  {
      e.should.equal(err);
      handled = true;
    })
    .modify(transform(() => { throw err; }))
    .apply(undefined)
    .subscribe(undefined, undefined, () => {
      handled.should.be.true;
      done();
    });
  });

  it('should only invoke the error handler in case of error.', done => {
    let handled = false;
    handleError(() => handled = true)
    .modify(transform(x => x))
    .apply(undefined)
    .subscribe(undefined, undefined, () => {
      handled.should.be.false;
      done();
    });
  });

  it('should also provide the error handler with the value that caused the error.', done => {
    let handled = false;
    const I = {};
    handleError((_, i: any) =>  {
      i.should.equal(I);
      handled = true;
    })
    .modify(transform(() => { throw Error(); }))
    .apply(I)
    .subscribe(undefined, undefined, () => {
      handled.should.be.true;
      done();
    });
  });

  it('should also allow the error handler with a callback to rethrow the error.', done => {
    let handled = false;
    const err = Error();
    handleError((e, __, rethrow) =>  {
      handled = true;
      rethrow(e);
    })
    .modify(transform(() => { throw err; }))
    .apply(undefined)
    .subscribe(undefined, e => {
      e.should.equal(err);
      handled.should.be.true;
      done();
    });
  });
});
