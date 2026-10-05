import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { stampGenerated, stripMark } from "#core/formatters/mark.formatter";
import type { Options } from "prettier";
import prettier from "prettier";

const writeChanged = function writeChanged(target: string, content: Uint8Array | string): void {
    const next = typeof content === "string" ? Buffer.from(content) : content;
    if (existsSync(target) && readFileSync(target).equals(next)) {
        return;
    }
    writeFileSync(target, next);
};

const canonicalText = async function canonicalText(target: string, text: string, options: Options): Promise<string> {
    const { inferredParser } = await prettier.getFileInfo(target);
    if (inferredParser === null && options.parser === undefined) {
        return text;
    }
    return prettier.format(text, { ...options, filepath: target });
};

export const writeCanonicalText = async function writeCanonicalText(
    target: string,
    text: string,
    options: Options = {},
): Promise<void> {
    writeChanged(target, await canonicalText(target, text, options));
};

export const writeCanonicalJson = async function writeCanonicalJson(
    target: string,
    data: unknown,
    options: Options = {},
): Promise<void> {
    await writeCanonicalText(target, JSON.stringify(data), options);
};

export const writeGeneratedMarkdown = async function writeGeneratedMarkdown(
    target: string,
    text: string,
    options: Options = {},
): Promise<void> {
    const body = await prettier.format(stripMark(text), { ...options, filepath: target });
    const previous = existsSync(target) ? readFileSync(target, "utf8") : "";
    writeChanged(target, stampGenerated(body, previous, new Date()));
};

export const writeVerbatim = function writeVerbatim(target: string, content: Uint8Array | string): void {
    writeChanged(target, content);
};
