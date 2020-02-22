import { should, expect } from 'chai'; should();

import { rmdir, unlink } from 'fs';

import { writeFile } from '../write-file';

import { readFile } from '../read-file';


describe('writeFile()', () => {
  afterEach(() => {
    unlink('src/fs/test/test-folder/bavaria/border/towns/neu-ulm.js', () => {
      rmdir('src/fs/test/test-folder/bavaria/border/towns', () => {
        rmdir('src/fs/test/test-folder/bavaria/border', () => {});
      });
    });

    unlink('src/fs/test/test-folder/baden-württemberg/border/towns/neu-ulm.js', () => {
      rmdir('src/fs/test/test-folder/baden-württemberg/border/towns', () => {
        rmdir('src/fs/test/test-folder/baden-württemberg/border', () => {});
      });
    });
  });

  it('should read contents of given file.', done => {
    writeFile()({
      path: 'border/towns/neu-ulm.js',
      root: 'src/fs/test/test-folder/bavaria',
      content: `// NEW ULM!`,
    }).then(() => {
      readFile()('src/fs/test/test-folder/bavaria/border/towns/neu-ulm.js').then(f => {
        f.content.should.equal(`// NEW ULM!`);
        done();
      });
    });
  });

  it('should overwrite the file\'s root if another root explicitly provided.', done => {
    writeFile({
      root: 'src/fs/test/test-folder/baden-württemberg'
    })({
      path: 'border/towns/neu-ulm.js',
      root: 'src/fs/test/test-folder/bavaria',
      content: `// NEW ULM!`,
    }).then(() => {
      readFile()('src/fs/test/test-folder/baden-württemberg/border/towns/neu-ulm.js').then(f => {
        f.content.should.equal(`// NEW ULM!`);
        done();
      });
    });
  });
});