"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const circularReplacer = () => {
    const seen = new WeakSet();
    const replacer = (_key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return '[Circular]';
            }
            seen.add(value);
        }
        return value;
    };
    return replacer;
};
exports.stringify = (value, space) => JSON.stringify(value, circularReplacer(), space);
//# sourceMappingURL=util.js.map