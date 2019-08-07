const { logger } = require( '../dist' )

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
