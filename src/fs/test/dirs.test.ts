import { should, expect } from 'chai'; should();

import { dirs } from '../dirs';
import { Line } from '../../line';


describe('dirs', () => {
  it('should generate a `Line`.', () => {
    dirs('src/fs/test/test-folder').should.be.instanceOf(Line);
  });

  it('should pass down the error in the observable if any occurs.', done => {
    dirs('DSIOJ!@)(*@')
    .content$.subscribe(undefined, () => done());
  });

  it('should list all the directories within given folder recursively.', done => {
    dirs('src/fs/test/test-folder')
    .collect(dirs => {
      dirs.length.should.equal(3);
      dirs.should.have.members([
        'src/fs/test/test-folder/baden-württemberg',
        'src/fs/test/test-folder/bavaria',
        'src/fs/test/test-folder/bavaria/munich'
      ]);
      done();
    });
  });

  it('should list all directories within given folder recursively using provided search root.', done => {
    dirs('test-folder', { root: 'src/fs/test' })
    .collect(dirs => {
      dirs.length.should.equal(3);
      dirs.should.have.members([
        'test-folder/baden-württemberg',
        'test-folder/bavaria',
        'test-folder/bavaria/munich'
      ]);
      done();
    });
  });

  it('should list directories within given folder and search root non-recursively if so specified.', done => {
    dirs('test-folder', { root: 'src/fs/test', recursive: false })
    .collect(dirs => {
      dirs.length.should.equal(2);
      dirs.should.have.members([
        'test-folder/baden-württemberg',
        'test-folder/bavaria'
      ]);
      done();
    });
  });
});
