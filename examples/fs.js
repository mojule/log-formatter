const { createLogger } = require( '../dist' )
const { appendFile } = require( 'fs' )

const stdOut = './examples/stdout.txt'
const stdErr = './examples/stderr.txt'

const append = ( path, data ) => appendFile(
  path, data + '\n', 'utf8', err => {
    if ( err ) console.error( err )
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
} catch ( err ) {
  logger.error( err )
} finally {
  logger.fatal( 'Exiting program because of the bad thing' )
  logger.time( 'My program' )
}

const getLocalTimestamp = () => {
  const date = new Date()
  const localTime = date.getTime() - ( date.getTimezoneOffset() * 60000 )

  return new Date( localTime ).toJSON()
}

const localLogger = createLogger(
  Object.assign( {}, options, { getTimestamp: getLocalTimestamp } )
)

localLogger.info( 'This should be using local time' )
