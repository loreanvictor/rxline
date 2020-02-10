import { files } from '../files';
import { readfile, File } from '../read-file';
import { pathmatch } from '../path-match';
import { dropExtension } from '../drop-extension';
import { extend } from '../../line/extend';

describe('files', () => {
  it('should do stuff', () => {
    files('fs', { root: 'src' })
    .drop(pathmatch(/.*\/test\/.*/))
    .pipe(readfile({ root: 'src' }))
    .pipe(extend(({ content }) => ({ lines: content.split('\n').length })))
    .pipe(({path, lines}) => ({ path, lines }))
    .pipe(dropExtension())
    .peek(console.log)
    .process();
  });
});
