import { should, expect } from 'chai'; should();

import { readFile } from '../read-file';


describe('readFile()', () => {
  it('should read contents of given file.', done => {
    readFile()({
      path: 'test-folder/bavaria/augsburg.js',
      root: 'src/fs/test',
      content: undefined,
    }).then(f => {
      f.content.should.equal(`module.exports = 'HALO!';`);
      done();
    });
  });

  it('should overwrite the file\'s root if another root explicitly provided.', done => {
    readFile({
      root: 'src/fs/test/test-folder/bavaria/munich'
    })({
      path: 'index.js',
      root: 'src/fs/test/test-folder/bavaria',
      content: undefined,
    }).then(f => {
      f.content.should.equal(`// munich-index`);
      done();
    });
  });

  it('should support reading from string paths.', done => {
    readFile()('src/fs/test/test-folder/bavaria/index.js').then(f => {
      f.content.should.equal(`// bavaria-index`);
      done();
    });
  });

  it('should properly handle errors.', done => {
    readFile()('ASIDJ()!@#').catch(() => done());
  });
});