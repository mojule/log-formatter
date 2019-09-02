const circularReplacer = () => {
  const seen = new WeakSet()

  const replacer = ( _key: string, value: any ) => {
    if ( typeof value === 'object' && value !== null ) {
      if ( seen.has( value ) ) {
        return '[Circular]'
      }

      seen.add( value )
    }

    return value
  }

  return replacer
}

export const stringify = ( value: any, space?: string | number ) =>
  JSON.stringify( value, circularReplacer(), space )
