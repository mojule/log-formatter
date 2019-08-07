import { LogFunction, Logger } from './types';
export declare const createLogger: (info?: LogFunction, error?: LogFunction, warn?: LogFunction) => Logger;
export declare const logger: Logger;
