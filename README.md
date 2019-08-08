# log-formatter

Simple formatting for logging

`npm install @mojule/log-formatter`

## usage

### default logger

```js
import { logger } from '@mojule/log-formatter'
```

or:

```js
const { logger } = require( '@mojule/log-formatter' )
```

```js
logger.time( 'My program' )

logger.trace( 'My program trace' )
logger.debug( 'Debug', { foo: { bar: { baz: [ 1, 2, 3 ] } } } )
logger.info( 'Hello, world!', 1, [ 1, 2, 3 ], 'etc' )

try {
  logger.warn( 'Uh oh' )

  throw Error( 'A bad thing happened' )
} catch( err ){
  logger.error( err )
} finally {
  logger.fatal( 'Exiting program because of the bad thing' )
  logger.time( 'My program' )
}
```

- `logger.trace`, `logger.debug`, `logger.time` go to console.debug
- `logger.info` goes to `console.info`
- `logger.warn` goes to `console.warn`
- `logger.error` and `logger.fatal` goes to `console.error`

Note that `trace` and `time` are handled internally for consistency of
formatting rather than using `console.trace` or `console.time`

```
time    2019-08-08T00:40:02.752Z        Start   My program
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
trace   2019-08-08T00:40:02.758Z        My program trace
────────────────────────────────────────────────────────────────────────────────
Trace:
    at Object.<anonymous> (log-formatter/examples/default.js:5:8)
    at Module._compile (internal/modules/cjs/loader.js:689:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:700:10)
    at Module.load (internal/modules/cjs/loader.js:599:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:538:12)
    at Function.Module._load (internal/modules/cjs/loader.js:530:3)
    at Function.Module.runMain (internal/modules/cjs/loader.js:742:12)
    at startup (internal/bootstrap/node.js:279:19)
    at bootstrapNodeJSCore (internal/bootstrap/node.js:752:3)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
debug   2019-08-08T00:40:02.759Z        Debug
────────────────────────────────────────────────────────────────────────────────
{
  "foo": {
    "bar": {
      "baz": [
        1,
        2,
        3
      ]
    }
  }
}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
info    2019-08-08T00:40:02.760Z        Hello, world!   1       [ 1, 2, 3 ]     etc
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
warn    2019-08-08T00:40:02.760Z        Uh oh
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
error   2019-08-08T00:40:02.760Z        Error   A bad thing happened
────────────────────────────────────────────────────────────────────────────────
Error: A bad thing happened
    at Object.<anonymous> (log-formatter/examples/default.js:12:9)
    at Module._compile (internal/modules/cjs/loader.js:689:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:700:10)
    at Module.load (internal/modules/cjs/loader.js:599:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:538:12)
    at Function.Module._load (internal/modules/cjs/loader.js:530:3)
    at Function.Module.runMain (internal/modules/cjs/loader.js:742:12)
    at startup (internal/bootstrap/node.js:279:19)
    at bootstrapNodeJSCore (internal/bootstrap/node.js:752:3)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
fatal   2019-08-08T00:40:02.761Z        Exiting program because of the bad thing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
time    2019-08-08T00:40:02.761Z        End     My program      0s 9.330659ms
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```

### simple file logger

`createLogger` allows you to provide functions to call for each of the logging
levels rather than using the defaults, which go to `stdout` and `stderr`

The functions you provide are called with a single string argument containing
the message

All functions are optional, if you don't provide them, the output will go
nowhere - you can use this to implement custom logging levels

```js
import { createLogger } from '@mojule/log-formatter'
import { appendFile } from 'fs'
```

or:

```js
const { createLogger } = require( '@mojule/log-formatter' )
const { appendFile } = require( 'fs' )
```

```js
const stdOut = './examples/stdout.txt'
const stdErr = './examples/stderr.txt'

const append = ( path, data ) => appendFile(
  path, data + '\n', 'utf8', err => {
    if( err ) console.error( err )
  }
)

const writeOut = content => append( stdOut, content )
const writeErr = content => append( stdErr, content )

const trace = writeOut
const debug = writeOut
const time = writeOut
const info = writeOut
const warn = writeErr
const error = writeErr
const fatal = writeErr

const options = {
  trace, debug, time, info, warn, error, fatal
}

const logger = createLogger( options )

logger.time( 'My program' )

logger.trace( 'My program trace' )
logger.debug( 'Debug', { foo: { bar: { baz: [ 1, 2, 3 ] } } } )
logger.info( 'Hello, world!', 1, [ 1, 2, 3 ], 'etc' )

try {
  logger.warn( 'Uh oh' )

  throw Error( 'A bad thing happened' )
} catch( err ){
  logger.error( err )
} finally {
  logger.fatal( 'Exiting program because of the bad thing' )
  logger.time( 'My program' )
}

```