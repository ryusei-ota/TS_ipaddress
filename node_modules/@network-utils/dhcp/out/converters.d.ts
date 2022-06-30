/// <reference types="node" />
export declare const IpConverter: {
    encode(data: string): Buffer;
    decode(data: Buffer): string;
};
export declare const MacConverter: {
    encode(data: string, len?: number | undefined): Buffer;
    decode(data: Buffer, len?: number | undefined): string;
};
