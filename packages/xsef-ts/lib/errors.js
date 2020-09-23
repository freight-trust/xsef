"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsingError = exports.$Errors = void 0;
// SPDX-License-Identifier: ISC
exports.$Errors = Symbol('FAILURE');
class ParsingError extends Error {
    constructor(line, lineNumber) {
        super(`ALERT: [${lineNumber}]"${line}"`);
        this.line = line;
        this.lineNumber = lineNumber;
    }
}
exports.ParsingError = ParsingError;
//# sourceMappingURL=errors.js.map