const { createLogger } = require( '../dist' )
const { appendFile } = require( 'fs' )

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
