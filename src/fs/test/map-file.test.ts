import { should, expect } from 'chai'; should();

import { mapContent, mapPath, mapRoot } from '../map-file';


describe('mapContent()', () => {
  it('should update the content of given file using given factory.', done => {
    mapContent((content, path, root) => {
      content.should.equal('z');
      path.should.equal('x');
      root.should.equal('y');
      return 'Z';
    })({
      path: 'x',
      root: 'y',
      content: 'z'
    }).then(f => {
      f.content.should.equal('Z');
      done();
    });
  });

  it('should not overwrite given file object.', done => {
    const F = { path: '', root: '', content: '' };
    mapContent(() => '')(F).then(f => {
      f.should.not.equal(F);
      done();
    });
  });

  it('should overwrite given file object if so specified.', done => {
    const F = { path: '', root: '', content: '' };
    mapContent(() => '', { overwrite: true })(F).then(f => {
      f.should.equal(F);
      done();
    });
  });
});

describe('mapPath()', () => {
  it('should update the path of given file using given factory.', done => {
    mapPath((path, root, content: any) => {
      content.should.equal('z');
      path.should.equal('x');
      root.should.equal('y');
      return 'Z';
    })({
      path: 'x',
      root: 'y',
      content: 'z'
    }).then(f => {
      f.path.should.equal('Z');
      done();
    });
  });

  it('should not overwrite given file object.', done => {
    const F = { path: '', root: '', content: '' };
    mapPath(() => '')(F).then(f => {
      f.should.not.equal(F);
      done();
    });
  });

  it('should overwrite given file object if so specified.', done => {
    const F = { path: '', root: '', content: '' };
    mapPath(() => '', { overwrite: true })(F).then(f => {
      f.should.equal(F);
      done();
    });
  });
});

describe('mapRoot()', () => {
  it('should update the root of given file using given factory.', done => {
    mapRoot((root, path, content: any) => {
      content.should.equal('z');
      path.should.equal('x');
      root.should.equal('y');
      return 'Z';
    })({
      path: 'x',
      root: 'y',
      content: 'z'
    }).then(f => {
      f.root.should.equal('Z');
      done();
    });
  });

  it('should not overwrite given file object.', done => {
    const F = { path: '', root: '', content: '' };
    mapRoot(() => '')(F).then(f => {
      f.should.not.equal(F);
      done();
    });
  });

  it('should overwrite given file object if so specified.', done => {
    const F = { path: '', root: '', content: '' };
    mapRoot(() => '', { overwrite: true })(F).then(f => {
      f.should.equal(F);
      done();
    });
  });
});