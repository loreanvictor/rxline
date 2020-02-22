import { should, expect } from 'chai'; should();

import { createFile } from '../create-file';
import { isFile } from '../types';
import { Transform } from '../../line';


describe('createFile()', () => {
  it('should create a transform.', () => {
    createFile(() => ({ path: 'x', content: 'y' })).should.be.instanceOf(Transform);
  });

  it('should create a `File` object based on provided path and content.', done => {
    createFile(() => ({ path: 'x', content: 'y' })).apply(undefined).subscribe(f => {
      isFile(f).should.be.true;
      f.path.should.equal('x');
      f.content.should.equal('y');
      done();
    });
  });

  it('should provide transform input to the factory function.', done => {
    createFile((i: any) => {
      i.should.equal(42);
      return { path: 'x', content: 'y' };
    }).apply(42).subscribe(() => done());
  });
});