import { should, expect } from 'chai'; should();

import { dropExt, mapExt } from '../extension';


describe('dropExt()', () => {
  it('should remove the extension from file path.', done => {
    dropExt()({ path: 'something/something.js' }).then(f => {
      f.path.should.equal('something/something');
      done();
    });
  });

  it('should work properly with multiple dots.', done => {
    dropExt()({ path: 'something/something.test.js' }).then(f => {
      f.path.should.equal('something/something.test');
      done();
    });
  });

  it('should not overwrite given file object.', done => {
    const F = { path: 'something/something.tsx' };
    dropExt()(F).then(f => {
      f.should.not.equal(F);
      done();
    });
  });

  it('should overwrite given file object when specified.', done => {
    const F = { path: 'something/something.tsx' };
    dropExt({ overwrite: true })(F).then(f => {
      f.should.equal(F);
      done();
    });
  });

  it('should also work properly on strings.', () => {
    dropExt<string>()('something/something.html').should.equal('something/something');
  });
});

describe('mapExt()', () => {
  it('should replace the extension of given file.', done => {
    mapExt(() => '.ts')({ path: 'something/something.js' }).then(f => {
      f.path.should.equal('something/something.ts');
      done();
    });
  });

  it('should work properly with multiple dots.', done => {
    mapExt(() => 'jsx')({ path: 'something/something.test.js' }).then(f => {
      f.path.should.equal('something/something.test.jsx');
      done();
    });
  });

  it('should provide given map function with properties of the given file.', done => {
    mapExt((ext, path, root, content) => {
      ext.should.equal('.html');
      path.should.equal('bla/blabla.html');
      root.should.equal('ladida');
      content.should.equal('stuff');
      done();
      return ext;
    })({
      path: 'bla/blabla.html',
      root: 'ladida',
      content: 'stuff'
    });
  });

  it('should not overwrite given file object.', done => {
    const F = { path: 'something/something.tsx' };
    mapExt(() => 'css')(F).then(f => {
      f.should.not.equal(F);
      done();
    });
  });

  it('should overwrite given file object when specified.', done => {
    const F = { path: 'something/something.tsx' };
    mapExt(() => 'cpp', { overwrite: true })(F).then(f => {
      f.should.equal(F);
      done();
    });
  });

  it('should also work properly on strings.', () => {
    mapExt<string>(() => 'json')('something/something.html').then(s => s.should.equal('something/something.json'));
  });
});