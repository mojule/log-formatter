const { logger } = require( '../dist' )

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
