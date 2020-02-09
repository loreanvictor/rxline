import { files } from '../files';
import { readfile, File } from '../read-file';
import { pathmatch } from '../path-match';
import { dropExtension } from '../drop-extension';
import { extend } from '../../line/extend';

describe.only('files', () => {
  files('fs', { root: 'src' })
  .drop(pathmatch(/.*\/test\/.*/))
  .pipe(readfile({ root: 'src' }))
  .pipe(extend(f => ({ lines: f.content.split('\n').length })))
  .pipe(f => ({ path: f.path, lines: f.lines }))
  .pipe(dropExtension())
  .peek(console.log)
  .process();
});