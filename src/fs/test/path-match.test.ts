import { should, expect } from 'chai'; should();

import { pathMatch } from '../path-match';


describe('pathMatch()', () => {
  it('should return a function matching the path field of given file against given regex.', () => {
    const match = pathMatch(/\.js$/);
    match({ path: 'something.js' }).should.be.true;
    match({ path: 'something.jsx' }).should.be.false;
  });

  it('should also work with strings.', () => {
    const match = pathMatch(/\.js$/);
    match('something.js').should.be.true;
    match('something.jsx').should.be.false;
  });
});