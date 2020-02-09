import { files } from '../files';

import { concurrently } from '../../line/process';


describe('files', () => {
  it('should work.', () => {
    files('src')
    .pick(x => x.endsWith('test.ts'))
    .tap(console.log)
    .process(concurrently);
  });
});