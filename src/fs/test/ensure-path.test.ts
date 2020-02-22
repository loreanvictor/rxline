import { should, expect } from 'chai'; should();

import { rmdir } from 'fs';

import { ensurePath } from '../ensure-path';
import { dirs } from '../dirs';
import { pathMatch } from '../path-match';


describe('ensurePath()', () => {
  afterEach(() => {
    rmdir('src/fs/test/test-folder/bavaria/border/towns', () => {
      rmdir('src/fs/test/test-folder/bavaria/border', () => {});
    });

    rmdir('TEST/X-FOLDER/Y-FOLDER', () => {
      rmdir('TEST/X-FOLDER', () => {
        rmdir('TEST', () => {});
      });
    });
  });

  it('should create necessary folders for given file if they do not exist.', done => {
    ensurePath({
      path: 'bavaria/border/towns/neu-ulm',
      root: 'src/fs/test/test-folder'
    }).then(() => {
      dirs('bavaria', { root: 'src/fs/test/test-folder' })
      .collect(r => {
        r.should.have.members([
          'bavaria/munich',
          'bavaria/border',
          'bavaria/border/towns',
        ]);
        done();
      });
    });
  });

  it('should support simple strings as well.', done => {
    ensurePath('TEST/X-FOLDER/Y-FOLDER/Z').then(() => {
      dirs('.')
      .pick(pathMatch(/^TEST/))
      .collect(r => {
        r.should.have.members([
          'TEST',
          'TEST/X-FOLDER',
          'TEST/X-FOLDER/Y-FOLDER',
        ]);
        done();
      });
    });
  });
});