# Error Handling

By default, if an error happens when applying the _transform_ of a _line_ on a particular 
item from its _content_, this error will break the _line_ and the rest of the line's content will also 
remain unprocessed. To handle such errors more gracefully, you can use the `handleError()` function:

```ts | --wmbar
import { line, handleError } from 'rxline';


function triple(x) {
  if (x == 2) throw Error('I HATE 2!!');
  else return x * 3;
}

line([1, 2, 3, 4])
.pipe(
  triple,                                          // --> triple the number
  handleError(error => console.log(error.message)) // --> log the errors
)
.collect(console.log);

// Result:
// > I HATE 2!!
// > [3, 9, 12]
```

> :Buttons
> > :CopyButton

The error handler function will also be provided with the input in the _line content_ which caused the issue:

```ts
line([1, 2, 3, 4])
.pipe(
  triple,
  handleError((err, num) => {
    console.log(`ERROR FOR ${num}:: ${err.message}`);
  })
)
.collect(console.log);

// Result:
// > ERROR FOR 2:: I HATE 2!!
// > [3, 9, 12]
```

The error handler function is also provided with a `rethrow` callback, which it can use to rethrow the error:

```ts
line([1, 2, 3, 4])
.pipe(
  triple,
  handleError((err, num, rethrow) => {
    console.log(`ERROR FOR ${num}`);
    rethrow(err);
  })
)
.collect(console.log);

// Result:
// > ERROR FOR 2
// > I HATE 2!!
```

<br>

> [error](:Icon) **IMPORTANT**
>
> Note that the `handleError()` function will only be able to handle errors 
> occuring before it in the line and not those that happen after.

> :ToCPrevNext