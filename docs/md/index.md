![logo](banner.svg)

**RxLine** helps you manage complex (possibly async) operations on collections (or streams) of entities. 
A common example is performing a series of tasks on a list of files 
(compiling sass to css or markdown to html).

# Installation

```bash
npm i rxline
```

---

# Usage

Typical usage of **RxLine** looks like this:

1. You define a _line_, i.e. a collection/stream of objects (called its _content_),
1. You define some (sync or async) transformations on the objects of the _line_ (called its _transform_),
1. You request the line to be processed, i.e. its _transform_ to be applied on its _content_.

```ts | --wmbar
import { line } from 'rxline';

line([1, 2, 3, 4])         // --> define the line
  .pipe(x => x * 2,        // --> add a transform
        x => x + 11)       // --> expand the transform
  .collect(console.log);   // --> process and collect the results.

// Result:
// [13, 15, 17, 19]
```

> :Buttons
> > :CopyButton

```ts | --wmbar
import { concurrently } from 'rxline';
import { files, mapContent, readFile, writeFile, pathMatch } from 'rxline/fs';

files('./src')                                // --> define the line
  .pick(pathMatch(/\.js$/))                   // --> filter its content
  .pipe(readFile())                           // --> read the content of the file
  .pipe(mapContent(                           // --> map the content of the file
    (content, path) =>                        // --> define the transform
      `/** @file ${path} **/\n` + content     // --> add a comment of the file's path on top of it
  ))
  .pipe(writeFile())                          // --> write the file to filesystem
  .process(concurrently);                     // --> process the line

// Result:
// adds a first line `/** @file module/filename.js **/` to each javascript file in `./src`
```

> :Buttons
> > :CopyButton

> :ToCPrevNext