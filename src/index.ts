import { LogLevel, Primitive, LogFunction, Logger } from './types'

export const createLogger = (
  info: LogFunction = console.log,
  error: LogFunction = console.error,
  warn: LogFunction = console.warn
) => {
  const timeStarts = new Map<string, [ number, number ]>()

  const log = ( level: LogLevel, head?: any, ...args: any ) => {
    const message = decorateLog( level, head, ...args )

    if ( level === 'info' || level === 'time' ) {
      info( message )
    }

    if ( level === 'error' ) {
      error( message )
    }

    if ( level === 'warn' ) {
      warn( message )
    }
  }

  const logger: Logger = {
    info: ( head?: any, ...args: any ) => log( 'info', head, ...args ),
    error: ( head?: any, ...args: any ) => log( 'error', head, ...args ),
    warn: ( head?: any, ...args: any ) => log( 'warn', head, ...args ),
    time: ( key: string ) => {
      const startTime = timeStarts.get( key )

      if ( startTime ) {
        timeStarts.delete( key )

        const [ s, ns ] = process.hrtime( startTime )

        log( 'time', 'End', key, `${ s }s ${ ns / 1e6 }ms` )
      } else {
        timeStarts.set( key, process.hrtime() )

        log( 'time', 'Start', key )
      }
    }
  }

  return logger
}

export const logger = createLogger()

const levels: LogLevel[] = [ 'error', 'info', 'warn', 'time' ]
const maxLength = Math.max( ...levels.map( l => l.length ) )
const columnSeparator = '\t'
const lineSeparatorLength = 80
const heavySeparator = `\n${ '━'.repeat( lineSeparatorLength ) }`
const lightSeparator = `\n${ '─'.repeat( lineSeparatorLength ) }`

const padLevel = ( level: LogLevel ) => level.padEnd( maxLength, ' ' )

const isPrimitive = ( value: any ): value is Primitive =>
  typeof value === 'string' || typeof value === 'number' ||
  typeof value === 'boolean' || typeof value === 'undefined' ||
  value === null

const isPrimitiveArray = ( value: any ): value is Primitive[] =>
  Array.isArray( value ) && value.every( isPrimitive )

const errorToParts = ( error: Error ) => {
  const {
    name = 'Unknown error',
    message = '',
    stack = ''
  } = error

  return [ name, message, stack ]
}

const primitiveArrayToString = ( arr: Primitive[] ) =>
  `[ ${
    arr.map( v => {
      if( typeof v === 'undefined' ) return 'undefined'

      return JSON.stringify( v )
    } ).join( ', ' )
  } ]`

const argsToParts = ( args: any[] ) => {
  const parts: string[] = []

  args.forEach( v => {
    if ( v instanceof Error ) {
      parts.push( ...errorToParts( v ) )
    } else if ( isPrimitive( v ) ) {
      parts.push( String( v ) )
    } else if ( isPrimitiveArray( v ) ) {
      parts.push( primitiveArrayToString( v ) )
    } else {
      parts.push( JSON.stringify( v, null, 2 ) )
    }
  } )

  return parts
}

const formatMultiline = ( parts: string[] ) => {
  let result = ''
  let isMultiline = false

  parts.forEach( part => {
    if ( part.includes( '\n' ) ) {
      if ( !isMultiline ) {
        result += lightSeparator
      }

      isMultiline = true
      result += '\n'
    } else {
      result += columnSeparator
    }

    result += part
  } )

  return result
}

const decorateLog = ( level: LogLevel, head?: any, ...args: any[] ) => {
  const prefix = padLevel( level )
  const timestamp = ( new Date() ).toJSON()
  const message = formatMultiline( argsToParts( [ head, ...args ] ) )

  return `${
    [ prefix, timestamp ].join( columnSeparator )
  }${
    message
  }${
    heavySeparator
  }`
}
