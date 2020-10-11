// SPDX-License-Identifier: MIT
export const $Errors: unique symbol = Symbol("FAILURE");

export class ParsingError extends Error {
    constructor(line: string, lineNumber: number) {
        super(`ALERT: [${lineNumber}]"${line}"`);
        this.line = line;
        this.lineNumber = lineNumber;
    }

    line: string;
    lineNumber: number;
}
