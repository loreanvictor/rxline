# <img src="https://raw.githubusercontent.com/loreanvictor/rxline/master/logo-cropped.svg?sanitize=true" width="128px"/> RxLine

[![Build Status](https://badgen.net/travis/loreanvictor/rxline?label=build&cache=300&icon=travis)](https://travis-ci.org/loreanvictor/rxline)
[![Code Coverage](https://badgen.net/codecov/c/github/loreanvictor/rxline?cache=300&icon=codecov)](https://codecov.io/gh/loreanvictor/rxline)
[![NPM Version](https://badgen.net/npm/v/rxline?cache=300&icon=npm)](https://www.npmjs.com/package/rxline)
[![License](https://badgen.net/github/license/loreanvictor/rxline?icon=github)](LICENSE)

A Javascript task pipeline library built on top of [RxJS](https://github.com/ReactiveX/rxjs). It helps you manage complex (possibly async) operations on collections (or streams) of entities. A common example is performing a series of tasks on a list of files (compiling sass to css or markdown to html).

```
npm i rxline
```


## Usage

Super basic example:

```javascript
import { line } from 'rxline';

line([1, 2, 3, 4])
  .pipe(x => x * 2)
  .pick(x => x > 3)
  .collect(console.log);
```

More real-life example:

```javascript
import { concurrently } from 'rxline';
import { files, pathMatch, 
         readFile, writeFile, 
         mapExt, mapContent, mapRoot } from 'rxline/fs';

files('.')                                                   // --> all files in current directory (and sub-directories)
  .pick(pathMatch(/\.js$/))                                  // --> pick javascript files
  .peek(f => console.log('-->' + f.path))                    // --> log each file path
  .pipe(readFile(),                                          // --> read contents of the file
        mapContent(c => ({ lines: c.split('\n').length })),  // --> map its content to an object with number of lines in it
        mapContent(c => JSON.stringify(c, null, 2)),         // --> also stringify the json object
        mapExt(() => '.json'),                               // --> change extension to `.json`
        mapRoot(() => '.meta'),                              // --> change root directory to `.meta`
        writeFile())                                         // --> write the files
  .process(concurrently);                                    // --> all in parallel.
```

👉[Checkout the Wiki for more details.](https://loreanvictor.github.io/rxline/)

## Why?

Because Gulp felt too opaque for me. I needed to be more in control.
