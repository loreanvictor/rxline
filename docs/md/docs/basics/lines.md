# Lines

Create an arbitrary _line_ using `line()` function:

```ts
import { line } from 'rxline';

line([1, 2, 3, 4]);                  // --> a line from an array
```

```ts
async function whatever() { 
  await stuff(); 
  return someArray;
}

line(whatever());                    // --> a line from a promised array
```

```ts
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

line(interval(1000).pipe(take(23))); // --> a line from an `Observable`
```

A _line_ is basically some _content_ and a _transform_ that is to be applied on 
the line's content. Applying the transform to line's content is called processing the line.

You can access the content of a line via its `.content$` property, which returns an `Observable`:

```ts
line([1, 2, 3, 4]).content$.subscribe(console.log);

// Result:
// 1, 2, 3, 4
```

---

## Transforms

```ts
line([1, 2, 3, 4]).pipe(x => x * 2);
```

This will yield a new _line_ who has the same _content_ but a different _transform_. 
Incoming transforms are combined with previous ones, so you can chain `.pipe()` multiple times:

```ts
line([1, 2, 3, 4])    // --> transform is x => x
  .pipe(x => x * 2)   // --> transform is x => x * 2
  .pipe(x => x + 3);  // --> transform is x => (x * 2) + 3
```

Or provide multiple arguments (which is equivalent to chaining):

```ts
line([1, 2, 3, 4])    // --> transform is x => x
  .pipe(x => x * 2,   // --> transform is x => x * 2
        x => x + 3);  // --> transform is x => (x * 2) + 3
```

You can also use `.pipe()` method to add asynchronous transforms:

```ts
line([1, 2, 3, 4])
  .pipe(async x => {
    await something();
    return x * 3;
  });
```

Or observable functions:

```ts
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { line } from 'rxline';

line([1, 2, 3, 4]).pipe(x => of(x).pipe(delay(100)));
```

You can use `.collect()` method to apply the final `transform` and collect the results as an array 
(more on `.collect()`'s details later):

```ts
line([1, 2, 3, 4])
  .pipe(x => x * 2)
  .pipe(x => x + 3)
  .collect(console.log);

// Result:
// [5, 7, 9, 11]
```

---

## Filtering

```ts
line([1, 2, 3, 4])
  .pick(x => x % 2 == 1)   // --> only pick odd numbers
  .pipe(x => x * 2)
  .collect(console.log);

// Result:
// [2, 6]
```

```ts
line([1, 2, 3, 4])
  .drop(x => x % 2 == 1)   // --> drop odd numbers
  .pipe(x => x * 2)
  .collect(console.log);

// Result:
// [4, 8]
```

Similar to `.pipe()`, you can provide async functions to `.pick()` or `.drop()`:

```ts
line(...).pick(async x => {
  await stuff();
  return x % 2 == 1;
});
```

---

## Peeking

```ts
line([1, 2, 3, 4])
  .peek(console.log)
  .pipe(x => x * 2)
  .peek(console.log)
  .collect(console.log);

// Result:
// 1, 2, 2, 4, 3, 6, 4, 8
// [2, 4, 6, 8]
```

---

## Processing

### `.collect()`

The _line_'s _transform_ will be applied to its _content_ and the result, gathered in an array, 
passed to given callback:

```ts
line([1, 2, 3, 4])
  .pipe(x => x * 10)
  .drop(x => x > 35)
  .collect(r => console.log(r.length));

// Result:
// 3
```

The method with which the transform is applied to the line's content is called a _processing strategy_. 
**RxLine** comes with two simple processing strategies: `sequentially` (one by one) and `concurrently` 
(all at once, in parallel). By default, `.collect()` uses `sequentially`, but you can provide it the processing strategy you need:

```ts
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { line, concurrently, sequentially } from 'rxline';

line([1, 2, 3, 4])
  .pipe(x => of(x * 3).pipe(delay(100 - (10 * x))))
  .collect(sequentially, console.log);

// Result:
// [3, 6, 9, 12]

line([1, 2, 3, 4])
  .pipe(x => of(x * 3).pipe(delay(100 - (10 * x))))
  .collect(concurrently, console.log);

// Result:
// [12, 9, 6, 3]
```

<br>

### `.process()`

Similar to `.collect()`, but instead of collecting the results in an array, 
will return a new _line_ who's content is the processed content of the original line:

```ts
const l1 = line([1, 2, 3, 4]).pipe(x => x * 2);
l1.content$.subscribe(console.log);
// 1, 2, 3, 4

const l2 = l1.process();
l2.content$.subscribe(console.log);
// 2, 4, 6, 8
```

Similar to `.collect()`, you can provide a processing strategy to `.process()`. 
By default it will use `sequentially`.

```ts
line([1, 2, 3, 4])
  .pipe(x => of(x * 3).pipe(delay(100 - (10 * x))))
  .peek(console.log)
  .process(concurrently);

// Result:
// 12, 9, 6, 3
```

> :ToCPrevNext