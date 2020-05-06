# Files

One of the most common use cases of task pipelines is doing something with several files. 
**RxLine** comes with utility functions in `rxline/fs` to make that super convenient.

Assume we have the following file structure:

```
./
-| bavaria/
-|-------| munich/
-|-------|-------| index.js
-|-------|-------| schwabing.js
-|-------| garching.js
-|-------| augsburg.ts
-| index.js
-| berlin.js
```

You can get all files like this:

```ts | --wmbar
/*!*/import { files } from 'rxline/fs';

/*!*/files('.')
  .peek(f => console.log(f.path))
  .process();

// Result:
// > index.js
// > berlin.js
// > bavaria/augsburg.ts
// > bavaria/garching.js
// > bavaria/munich/index.js
// > bavaria/munich/schwabing.js
```

> :Buttons
> > :CopyButton

`files()` creates a line with `File` objects representing all files in given address.

You can turn off the recursive scan:

```ts
/*!*/files('.', { recursive: false })
  .peek(f => console.log(f.path))
  .process();

// Result:
// > index.js
// > berlin.js
```

You can change scan root:

```ts
/*!*/files('.', { root: 'bavaria' })
  .peek(f => console.log(f.path))
  .process();

// Result:
// > garching.js
// > augsburg.ts
// > munich/index.js
// > munich/schwabing.js
```

Or specify search directory:

```ts
/*!*/files('munich', { root: 'bavaria' })
  .peek(f => console.log(f.path))
  .process();

// Result:
// > munich/index.js
// > munich/schwabing.js
```

---

## Path Filtering

```ts | --wmbar
import { files, pathMatch } from 'rxline/fs';

files('bavaria')                  // --> scan files in `bavaria`
/*!*/  .pick(pathMatch(/\.js$/))       // --> pick those with `.js` extension
  .peek(f => console.log(f.path))
  .process();

// Result:
// > bavaria/garching.js
// > bavaria/munich/index.js
// > bavaria/munich/schwabing.js
```

> :Buttons
> > :CopyButton

```ts
files('.')
/*!*/  .drop(pathMatch(/\/munich\//))   // --> drop files in `munich` folder
  .peek(f => console.log(f.path))
  .process();

// Result:
// > index.js
// > berlin.js
// > bavaria/garching.js
// > bavaria/augsburg.ts
```

---

## Reading Files

By default, the content of the files are not loaded:

```ts
files('munich', { root: 'bavaria')
  .peek(f => console.log(f.path + ' : ' + f.content))
  .process();

// Result:
// > munich/index.js : undefined
// > munich/schwabing.js : undefined
```

You can load file contents using `readFile()`:

```ts | --wmbar
/*!*/import { files, readFile } from 'rxline/fs';

files('munich', { root: 'bavaria')
/*!*/  .pipe(readFile())
  .peek(f => console.log(f.path + ' : ' + f.content.split('\n').length + ' lines'))
  .process();

// Result:
// > munich/index.js : 56 lines
// > munich/schwabing.js : 215 lines
```

> :Buttons
> > :CopyButton

---

## Modifying and Saving

You can use `mapContent()` to modify file contents, and `writeFile()` to save the files:

```ts | --wmbar
import { concurrently } from 'rxline';
/*!*/import { files, pathMatch, readFile, writeFile, mapContent } from 'rxline/fs';

files('.', { root: 'bavaria' })                                   // --> all files with root: `bavaria/`
  .pick(pathMatch(/\.js$/))                                       // --> pick `.js` files
/*!*/  .pipe(readFile(),                                               // --> read'em
/*!*/        mapContent(
/*!*/          (content, path) => `/** file: ${path} **/\n` + content  // --> modify the content (in memory)
/*!*/        ),
/*!*/        writeFile())                                              // --> save them
  .process(concurrently);                                         // --> all in parallel.

// Adds first line `/** file: garching.js **/` to `bavaria/garching.js`
// Adds first line `/** file: munich/index.js **/ to `bavaria/munich/index.js`
// Adds first line `/** file: munich/schwabing.js **/ to `bavaria/munich/schwabing.js`
```

> :Buttons
> > :CopyButton

---

## Modifying Path & Extension

`mapPath()` modifies each file's path:

```ts | --wmbar
import { files, readFile, writeFile, mapPath, pathMatch } from 'rxline/fs';

files('.')
  .drop(pathMatch(/\.js$/))              // --> drop all `.js` files
  .pipe(readFile(),                      // --> read the rest
/*!*/        mapPath(path => path + '.bak'),  // --> add `.bak` to their path
        writeFile())                     // --> save them.
  .process();

// Creates `bavaria/augsburg.ts.bak`, a copy of `bavaria/augsburg.ts`.
```

> :Buttons
> > :CopyButton

`mapExt()` modifies each file's extension:

```ts | --wmbar
import { files, readFile, writeFile, mapExt } from 'rxline/fs';

files('.', { root : 'bavaria' })
  .pipe(readFile(),                   // --> read the files
/*!*/        mapExt(ext => 'bak' + ext),   // --> suffix `bak` to their extension
        writeFile())                  // --> save them.
  .process();

// Creates `bavaria/augsburg.bak.ts`, a copy of `bavaria/augsburg.ts`.
// Creates `bavaria/garching.bak.js`, a copy of `bavaria/garching.js`.
// Creates `bavaria/munich/index.bak.js`, a copy of `bavaria/munich/index.js`.
// Creates `bavaria/munich/schwabing.bak.js`, a copy of `bavaria/munich/schwabing.js`.
```

> :Buttons
> > :CopyButton

`mapRoot()` modifies the root folder (so you can easily move files somewhere else):

```ts | --wmbar
import { files, readFile, writeFile, mapExt, mapRoot } from 'rxline/fs';

files('munich', { root : 'bavaria' })
  .pipe(readFile(),                // --> read the files
/*!*/        mapRoot(() => 'backup'),   // --> change their root to `backup/`
        writeFile())               // --> save them.
  .process();

// Creates `backup/munich/index.js`, a copy of `bavaria/munich/index.js`.
// Creates `backup/munich/schwabing.js`, a copy of `bavaria/munich/schwabing.js`.
```

> :Buttons
> > :CopyButton

> :ToCPrevNext