import { files } from '../files';
import { readFile } from '../read-file';
import { pathMatch } from '../path-match';
import { mapExt } from '../extension';
import { mapContent, mapRoot } from '../map-file';
import { writeFile } from '../write-file';


describe('files', () => {
  it('should do stuff', () => {

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
