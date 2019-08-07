export declare type LogFunction = (message?: any, ...optionalParams: any[]) => void;
export declare type TimeFunction = (key: string) => void;
export declare type LogLevel = 'error' | 'info' | 'warn' | 'time';
export interface Logger {
    info: LogFunction;
    error: LogFunction;
    warn: LogFunction;
    time: TimeFunction;
}
export declare type Primitive = string | number | boolean | undefined | null;
