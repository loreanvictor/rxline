import { should, expect } from 'chai'; should();

import { partition } from '../partition';
import { line } from '../line';


describe('partition()', () => {
  it('should return a line of lines, each line\'s content being entities with matching partitioning.', done => {
    let seenGroups = 0;
    
    line([
      {name: 'dude', age: 24}, 
      {name: 'joe', age: 31},
      {name: 'jack', age: 24},
      {name: 'joseph', age: 24},
      {name: 'jill', age: 32},
      {name: 'jessie', age: 31},
    ])
    .funnel(partition(p => p.age))
    .collect(lines => {
      lines.forEach(line => {
        line.collect(group => {
          seenGroups++;
          if (group.length == 1) group.should.have.deep.members([{name: 'jill', age: 32}]);
          else if (group.length == 2) 
            group.should.have.deep.members([{name: 'jessie', age: 31}, {name: 'joe', age: 31}]);
          else if (group.length == 3)
            group.should.have.deep.members([
              {name: 'dude', age: 24},
              {name: 'jack', age: 24},
              {name: 'joseph', age: 24},
            ]);
          else throw Error('this should not have happened.');

          if (seenGroups >= 3) done();
        });
      });
    });
  });
});