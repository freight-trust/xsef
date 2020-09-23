export declare const $Errors: unique symbol;
export declare class ParsingError extends Error {
    constructor(line: string, lineNumber: number);
    line: string;
    lineNumber: number;
}
