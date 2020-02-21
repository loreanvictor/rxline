import { should, expect } from 'chai'; should();

import { files } from '../files';
import { isFile } from '../types';
import { Line } from '../../line';


describe('files', () => {
  it('should generate a `Line`, with its elements being `File` objects.', done => {
    const f = files('src/fs/test/test-folder');
    f.should.be.instanceOf(Line);
    f.collect(files => {
      files.forEach(file => isFile(file).should.be.true);
      done();
    });
  });

  it('should pass down the error in the observable if any occurs.', done => {
    files('DSIOJ!@)(*@')
    .content$.subscribe(undefined, () => done());
  });

  it('should list all the files within given folder recursively.', done => {
    files('src/fs/test/test-folder')
    .collect(files => {
      files.length.should.equal(9);
      files.map(f => f.path).should.have.members([
        'src/fs/test/test-folder/germany.js',
        'src/fs/test/test-folder/index.tsx',
        'src/fs/test/test-folder/baden-württemberg/stuttgart.js',
        'src/fs/test/test-folder/baden-württemberg/ulm.ts',
        'src/fs/test/test-folder/bavaria/augsburg.js',
        'src/fs/test/test-folder/bavaria/garching.ts',
        'src/fs/test/test-folder/bavaria/index.js',
        'src/fs/test/test-folder/bavaria/munich/index.js',
        'src/fs/test/test-folder/bavaria/munich/schwabing.ts'
      ]);
      done();
    });
  });

  it('should list all files within given folder recursively using provided search root.', done => {
    files('test-folder', { root: 'src/fs/test' })
    .collect(files => {
      files.length.should.equal(9);
      files.map(f => f.path).should.have.members([
        'test-folder/germany.js',
        'test-folder/index.tsx',
        'test-folder/baden-württemberg/stuttgart.js',
        'test-folder/baden-württemberg/ulm.ts',
        'test-folder/bavaria/augsburg.js',
        'test-folder/bavaria/garching.ts',
        'test-folder/bavaria/index.js',
        'test-folder/bavaria/munich/index.js',
        'test-folder/bavaria/munich/schwabing.ts'
      ]);
      done();
    });
  });

  it('should list files within given folder and search root non-recursively if so specified.', done => {
    files('bavaria', { root: 'src/fs/test/test-folder', recursive: false })
    .collect(files => {
      files.length.should.equal(3);
      files.map(f => f.path).should.have.members([
        'bavaria/augsburg.js',
        'bavaria/garching.ts',
        'bavaria/index.js'
      ]);
      done();
    });
  });

  it('should not load contents of the files.', done => {
    files('baden-württemberg', { root: 'src/fs/test/test-folder' })
    .collect(files => {
      files.forEach(file => expect(file.content).to.be.undefined);
      done();
    });
  });

  it('should set specified search root as `.root` property of each file.', done => {
    files('.', { root: 'src/fs/test/test-folder' })
    .collect(files => {
      files.forEach(file => file.root.should.equal('src/fs/test/test-folder'));
      done();
    });
  });

  it('should set `.root` as empty string when no search root is specified.', done => {
    files('src/fs/test/test-folder')
    .collect(files => {
      files.forEach(file => file.root.should.equal(''));
      done();
    });
  });
});
