# Transforms

As mentioned before, each _line_ in **RxLine** is a stream of objects and a 
_transform_ that is to be applied on those objects. The core of any transform is 
a function that returns one or more values based on given value either 
synchronously or asynchronously, i.e.:

```ts
export type Function<I, O> = (i: I) => O | Promise<O> | Observable<O>;
```

Working with these functions can be inconvenient due to different possible return types. 
**RxLine** provides the `Transform` class and `transform()` function to address that inconvenience:

```ts | --wmbar
/*!*/import { transform } from 'rxline';
import { from } from 'rxjs';


/*!*/const X = transform(async x => await somefunc(x));
/*!*/const Y = transform(x => from([x, x + 1]));
/*!*/const Z = X.combine(Y);
Z.apply(42).subscribe(console.log);

// Result:
// > somefunc(42)
// > somefunc(42) + 1
```

> :Buttons
> > :CopyButton

`.combine()` can also be provided a `Function` directly:

```ts
const Z = transform(async x => await somefunc(x))
/*!*/           .combine(x => from([x, x + 1]));
```

`Transforms` are the objects that you should provide to a _line_'s `.pipe()` method. 
For convenience, if you provide it with any `Function`, it will automatically wrap it with the `transform()` 
method:

```ts
const l = line(...); // --> or files(...) or any other line generator

// These two are equivalent
/*!*/l.pipe(x => x + 2);             // --> These two are equivalent
/*!*/l.pipe(transform(x => x + 2));  // --> These two are equivalent
```

Additionally, chaining pipe on a _line_ (or providing multiple arguments to it) is equivalent 
of calling `.combine()` on the _line_'s transform:

```ts
const l = line(...);

// These three are equivalent:
/*!*/l.pipe(transformA).pipe(transformB).pipe(transformC);       // --> These three are equivalent
/*!*/l.pipe(transformA, transformB, transformC);                 // --> These three are equivalent
/*!*/l.pipe(transformA.combine(transformB).combine(transformC)); // --> These three are equivalent
```

Which can be helpful in writing your own custom transforms:

```ts | --wmbar
import { transpile } from 'typescript';
import { mapExt, mapContent } from 'rxline';

export const compileTS = 
    transform(mapContent(content => transpile(content)))    // --> so will transpile the typescript
      .combine(mapExt(() => '.js'));                        // --> and change the extension to `.js`
```

> :Buttons
> > :CopyButton

> :ToCPrevNext