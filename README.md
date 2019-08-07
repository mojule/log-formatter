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

logger.info( 'Hello, world!', 1, [ 1, 2, 3 ], 'etc' )

try {
  logger.warn( 'Uh oh' )

  throw Error( 'A bad thing happened' )
} catch( err ){
  logger.error( err )
} finally {
  logger.time( 'My program' )
}
```

- `logger.info` and `logger.time` go to `console.log`
- `logger.warn` goes to `console.warn`
- `logger.error` goes to `console.error`

```
time    2019-08-07T03:43:43.500Z        Start   My program
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
info    2019-08-07T03:43:43.506Z        Hello, world!   1       [ 1, 2, 3 ]     etc
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
warn    2019-08-07T03:43:43.507Z        Uh oh
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
error   2019-08-07T03:43:43.508Z        Error   A bad thing happened
────────────────────────────────────────────────────────────────────────────────
Error: A bad thing happened
    at Object.<anonymous> (log-formatter/examples/default.js:10:9)
    at Module._compile (internal/modules/cjs/loader.js:689:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:700:10)
    at Module.load (internal/modules/cjs/loader.js:599:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:538:12)
    at Function.Module._load (internal/modules/cjs/loader.js:530:3)
    at Function.Module.runMain (internal/modules/cjs/loader.js:742:12)
    at startup (internal/bootstrap/node.js:279:19)
    at bootstrapNodeJSCore (internal/bootstrap/node.js:752:3)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
time    2019-08-07T03:43:43.509Z        End     My program      0s 5.590741ms
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```

### simple file logger

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
const writeWarn = writeErr

const logger = createLogger( writeOut, writeErr, writeWarn )

logger.time( 'My program' )

logger.info( 'Hello, world!', 1, [ 1, 2, 3 ], 'etc' )

try {
  logger.warn( 'Uh oh' )

  throw Error( 'A bad thing happened' )
} catch( err ){
  logger.error( err )
} finally {
  logger.time( 'My program' )
}

```