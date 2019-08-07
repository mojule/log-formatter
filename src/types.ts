export type LogFunction = ( message?: any, ...optionalParams: any[] ) => void

export type TimeFunction = ( key: string ) => void

export type LogLevel = 'error' | 'info' | 'warn' | 'time'

export interface Logger {
  info: LogFunction
  error: LogFunction
  warn: LogFunction
  time: TimeFunction
}

export type Primitive = string | number | boolean | undefined | null
