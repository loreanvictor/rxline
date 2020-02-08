import { line } from '../line';


describe('line', () => {
  it('should work (generally)', () => {
    line([1, 2, 3, 4])
    .pipe(x => x * 2)
    .pipe(x => { console.log(x); return x; })
    .process()
    .pick(x => x > 5)
    .pipe(console.log)
    .process();
  });
});