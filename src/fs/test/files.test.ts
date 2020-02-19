import { files } from '../files';
import { readFile } from '../read-file';
import { pathMatch } from '../path-match';
import { mapExt } from '../extension';
import { mapContent, mapRoot } from '../map-file';
import { writeFile } from '../write-file';

import { concurrently } from '../../line';


describe('files', () => {
  it('should do stuff', () => {

    // files('es5', { root: 'dist' })
    //   .pick(pathMatch(/\.js$/))
    //   .pipe(readFile())
    //   .pipe(mapContent((content, path) => `/** file: ${path} **/\n` + content))
    //   .pipe(writeFile())
    //   .process(concurrently);
    // files('', { root: 'dist/es6' })
    // .pick(pathMatch(/.*\.js$/))
    // .peek(f => console.log('-->' + f.path))
    // .pipe(readFile())
    // .pipe(mapContent(c => ({ lines: c.split('\n').length })))
    // .pipe(mapContent(c => JSON.stringify(c, null, 2)))
    // .pipe(mapExt(() => '.json'))
    // .pipe(mapRoot(() => 'dist/meta'))
    // .pipe(writeFile())
    // .process();

  });
});
