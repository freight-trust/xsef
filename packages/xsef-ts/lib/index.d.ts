import { $Errors } from './errors';
export * from './errors';
export interface IParseConfig {
    comment?: string;
    delimiter?: string;
    nothrow?: boolean;
    autoTyping?: boolean;
    dataSections?: string[];
}
export interface IStringifyConfig {
    delimiter?: string;
    blankLine?: boolean;
    spaceBefore?: boolean;
    spaceAfter?: boolean;
}
export declare type IXSEFVaule = string | number | boolean | IXSEFObjectSection | IXSEFObjectDataSection;
export interface IXSEFObjectSection {
    [index: string]: IXSEFVaule;
}
export declare type IXSEFObjectDataSection = string[];
export interface IXSEFObject extends IXSEFObjectSection {
    [$Errors]?: any;
}
export declare function parse(data: string, params?: IParseConfig): IXSEFObject;
export declare function stringify(data: IXSEFObject, params?: IStringifyConfig): string;
export declare const decode: typeof parse;
export declare const encode: typeof stringify;
