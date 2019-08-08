"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = (options = exports.defaultCreateLoggerOptions) => {
    const loggerFn = Object.assign({}, noopLogger, options);
    const timeStarts = new Map();
    const log = (level, head, ...args) => {
        const message = decorateLog(level, head, ...args);
        const logFn = loggerFn[level];
        logFn(message);
    };
    const createLoggerFn = (type) => (head, ...params) => log(type, head, ...params);
    const debug = createLoggerFn('debug');
    const trace = (head, ...params) => {
        try {
            throw Error('trace');
        }
        catch (err) {
            const { stack } = err;
            let traceResult = '';
            const lines = stack.split('\n');
            if (lines.length > 2) {
                const [, , ...rest] = lines;
                traceResult = `Trace:\n${rest.join('\n')}`;
            }
            log('trace', head, ...params, traceResult);
        }
    };
    const info = createLoggerFn('info');
    const warn = createLoggerFn('warn');
    const error = createLoggerFn('error');
    const fatal = createLoggerFn('fatal');
    const time = (key, ...params) => {
        const startTime = timeStarts.get(key);
        if (startTime) {
            timeStarts.delete(key);
            const [s, ns] = process.hrtime(startTime);
            log('time', 'End', key, `${s}s ${ns / 1e6}ms`, ...params);
        }
        else {
            timeStarts.set(key, process.hrtime());
            log('time', 'Start', key, ...params);
        }
    };
    const logger = {
        trace, debug, info, warn, error, fatal, time
    };
    return logger;
};
exports.defaultCreateLoggerOptions = {
    trace: console.debug,
    debug: console.debug,
    time: console.debug,
    info: console.log,
    warn: console.warn,
    error: console.error,
    fatal: console.error
};
const noop = () => { };
const noopLogger = {
    trace: noop,
    debug: noop,
    info: noop,
    warn: noop,
    error: noop,
    fatal: noop,
    time: noop
};
exports.logLevels = [
    'trace', 'debug', 'time', 'info', 'warn', 'error', 'fatal'
];
const maxLength = Math.max(...exports.logLevels.map(l => l.length));
const columnSeparator = '\t';
const lineSeparatorLength = 80;
const heavySeparator = `\n${'━'.repeat(lineSeparatorLength)}`;
const lightSeparator = `\n${'─'.repeat(lineSeparatorLength)}`;
const padLevel = (level) => level.padEnd(maxLength, ' ');
const isPrimitive = (value) => typeof value === 'string' || typeof value === 'number' ||
    typeof value === 'boolean' || typeof value === 'undefined' ||
    value === null;
const isPrimitiveArray = (value) => Array.isArray(value) && value.every(isPrimitive);
const errorToParts = (error) => {
    const { name = 'Unknown error', message = '', stack = '' } = error;
    return [name, message, stack];
};
const primitiveArrayToString = (arr) => `[ ${arr.map(v => {
    if (typeof v === 'undefined')
        return 'undefined';
    return JSON.stringify(v);
}).join(', ')} ]`;
const argsToParts = (args) => {
    const parts = [];
    args.forEach(v => {
        if (v instanceof Error) {
            parts.push(...errorToParts(v));
        }
        else if (isPrimitive(v)) {
            parts.push(String(v));
        }
        else if (isPrimitiveArray(v)) {
            parts.push(primitiveArrayToString(v));
        }
        else {
            parts.push(JSON.stringify(v, null, 2));
        }
    });
    return parts;
};
const formatMultiline = (parts) => {
    let result = '';
    let isMultiline = false;
    parts.forEach(part => {
        if (part.includes('\n')) {
            if (!isMultiline) {
                result += lightSeparator;
            }
            isMultiline = true;
            result += '\n';
        }
        else {
            result += columnSeparator;
        }
        result += part;
    });
    return result;
};
const decorateLog = (level, head, ...args) => {
    const prefix = padLevel(level);
    const timestamp = (new Date()).toJSON();
    const message = formatMultiline(argsToParts([head, ...args]));
    return `${[prefix, timestamp].join(columnSeparator)}${message}${heavySeparator}`;
};
exports.logger = exports.createLogger();
//# sourceMappingURL=index.js.map