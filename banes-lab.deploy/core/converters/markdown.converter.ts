import { LINE_BREAK } from "#configuration/constants/deployment.constants";

const BULLET = "• **";
const LABEL_END = ":** ";
const CODE = "`";
const FENCE = "```";

export const bullet = function bullet(label: string, value: string): string {
    return BULLET + label + LABEL_END + value;
};

export const code = function code(value: string): string {
    return CODE + value + CODE;
};

export const fenced = function fenced(value: string): string {
    return FENCE + value + FENCE;
};

export const fencedBlock = function fencedBlock(language: string, value: string): string {
    return FENCE + language + LINE_BREAK + value + LINE_BREAK + FENCE;
};

export const link = function link(label: string, url: string): string {
    return `[${label}](${url})`;
};

export const relative = function relative(unixSeconds: number): string {
    return `<t:${String(unixSeconds)}:R>`;
};

export const lines = function lines(entries: readonly string[]): string {
    return entries.join(LINE_BREAK);
};
