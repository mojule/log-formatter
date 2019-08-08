export declare type LogFunction = (message?: any, ...optionalParams: any[]) => void;
export declare type TimeFunction = (key: string, ...optionalParams: any[]) => void;
export declare type LogLevel = 'trace' | 'debug' | 'time' | 'info' | 'warn' | 'error' | 'fatal';
export interface CreateLoggerOptions {
    trace?: LogFunction;
    debug?: LogFunction;
    info?: LogFunction;
    warn?: LogFunction;
    error?: LogFunction;
    fatal?: LogFunction;
    time?: TimeFunction;
}
export interface Logger {
    trace: LogFunction;
    debug: LogFunction;
    info: LogFunction;
    warn: LogFunction;
    error: LogFunction;
    fatal: LogFunction;
    time: TimeFunction;
}
export declare type Primitive = string | number | boolean | undefined | null;
