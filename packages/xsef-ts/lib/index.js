"use strict";
// SPDX-License-Identifier: ISC
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encode = exports.decode = exports.stringify = exports.parse = void 0;
const errors_1 = require("./errors");
__exportStar(require("./errors"), exports);
const sectionNameRegex = /\[(.*)]$/;
const autoType = (val) => {
    if ((val === 'true') || (val === 'false')) {
        return val === 'true';
    }
    if (val === '') {
        return true;
    }
    if (!isNaN(parseFloat(val))) {
        return parseFloat(val);
    }
    return val;
};
function parse(data, params) {
    const { delimiter = '=', comment = ';', nothrow = false, autoTyping = true, dataSections = [] } = Object.assign({}, params);
    const lines = data.split(/\r?\n/g);
    let lineNumber = 0;
    let currentSection = '';
    let isDataSection = false;
    const result = {};
    for (const rawLine of lines) {
        lineNumber += 1;
        const line = rawLine.trim();
        if ((line.length === 0) || (line.startsWith(comment))) {
            continue;
        }
        else if (line[0] === '[') {
            const match = line.match(sectionNameRegex);
            if (match !== null) {
                currentSection = match[1].trim();
                isDataSection = dataSections.includes(currentSection);
                if (!(currentSection in result)) {
                    result[currentSection] = (isDataSection) ? [] : {};
                }
                continue;
            }
        }
        else if (isDataSection) {
            result[currentSection].push(rawLine);
            continue;
        }
        else if (line.includes(delimiter)) {
            const posOfDelimiter = line.indexOf(delimiter);
            const name = line.slice(0, posOfDelimiter).trim();
            const rawVal = line.slice(posOfDelimiter + 1).trim();
            const val = (autoTyping) ? autoType(rawVal) : rawVal;
            if (currentSection !== '') {
                result[currentSection][name] = val;
            }
            else {
                result[name] = val;
            }
            continue;
        }
        const error = new errors_1.ParsingError(line, lineNumber);
        if (!nothrow) {
            throw error;
        }
        else {
            if (errors_1.$Errors in result) {
                result[errors_1.$Errors].push(error);
            }
            else {
                result[errors_1.$Errors] = [error];
            }
        }
    }
    return result;
}
exports.parse = parse;
function stringify(data, params) {
    const { delimiter = '=', blankLine = true, spaceBefore = false, spaceAfter = false } = Object.assign({}, params);
    const chunks = [];
    const formatPare = (key, val) => {
        let res = key;
        if (spaceBefore) {
            res += ' ';
        }
        res += delimiter;
        if (spaceAfter) {
            res += ' ';
        }
        res += val;
        return res;
    };
    let sectionKeys = null;
    let curKeyId = 0;
    for (const key of Object.keys(data)) {
        while (!sectionKeys || (sectionKeys.length !== curKeyId)) {
            let curKey;
            if (sectionKeys) {
                curKey = sectionKeys[curKeyId];
                curKeyId += 1;
            }
            else {
                curKey = key;
            }
            const val = (sectionKeys) ? data[key][curKey] : data[curKey];
            const valType = typeof val;
            if (['boolean', 'string', 'number'].includes(valType)) {
                chunks.push(formatPare(curKey, val.toString()));
                if (!sectionKeys) {
                    break;
                }
            }
            else if (typeof val === 'object') {
                if (sectionKeys) {
                    throw new Error('too much nesting');
                }
                if (blankLine) {
                    chunks.push('');
                }
                chunks.push(`[${key}]`);
                if (Array.isArray(val)) {
                    chunks.push(...val);
                    break;
                }
                else {
                    sectionKeys = Object.keys(val);
                }
            }
        }
        sectionKeys = null;
        curKeyId = 0;
    }
    return chunks.join('\n');
}
exports.stringify = stringify;
exports.decode = parse;
exports.encode = stringify;
//# sourceMappingURL=index.js.map