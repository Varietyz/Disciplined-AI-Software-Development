import { readFileSync, readdirSync } from "node:fs";
import { ROOT } from "@ssot/paths";
import type { ReferenceFinding } from "../../types/analyzer.types.ts";
import { excludeMatcher } from "@govlab/quality/config";
import path from "node:path";
import { tokenIn } from "../../shared/registries/location.registry.ts";

const excluded = await excludeMatcher(ROOT);

const walk = function walk(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true })
        .filter((entry) => !(entry.isDirectory() && excluded(path.join(dir, entry.name))))
        .flatMap((entry) => {
            const full = path.join(dir, entry.name);
            return entry.isDirectory() ? walk(full) : [full];
        });
};

const readText = function readText(file: string): string {
    return readFileSync(file, "utf8");
};

const WHITESPACE = new Set([" ", "\t", "\n", "\r"]);
const QUOTES = new Set(['"', "'"]);
const ATTRIBUTE_MARKERS = ["src=", "href="];
const URL_MARKER = "url(";
const MARKUP_EXTENSIONS = new Set([".html", ".css"]);

const skipWhitespace = function skipWhitespace(text: string, from: number): number {
    let at = from;
    while (at < text.length && WHITESPACE.has(text[at] ?? "")) {
        at += 1;
    }
    return at;
};

const readUntil = function readUntil(text: string, from: number, terminators: ReadonlySet<string>): string | null {
    let at = from;
    while (at < text.length && !terminators.has(text[at] ?? "")) {
        at += 1;
    }
    return at > from && at < text.length ? text.slice(from, at) : null;
};

const attributeValues = function attributeValues(text: string, marker: string): string[] {
    const out: string[] = [];
    let at = text.indexOf(marker);
    while (at !== -1) {
        const afterEquals = skipWhitespace(text, at + marker.length);
        const quote = text[afterEquals] ?? "";
        if (QUOTES.has(quote)) {
            const value = readUntil(text, afterEquals + 1, new Set([quote]));
            if (value !== null) {
                out.push(value);
            }
        }
        at = text.indexOf(marker, at + marker.length);
    }
    return out;
};

const urlValues = function urlValues(text: string): string[] {
    const out: string[] = [];
    let at = text.indexOf(URL_MARKER);
    while (at !== -1) {
        const opened = skipWhitespace(text, at + URL_MARKER.length);
        const quote = text[opened] ?? "";
        const start = QUOTES.has(quote) ? opened + 1 : opened;
        const value = readUntil(text, start, new Set(['"', "'", ")"]));
        if (value !== null) {
            out.push(value.trim());
        }
        at = text.indexOf(URL_MARKER, at + URL_MARKER.length);
    }
    return out;
};

const markupReferences = function markupReferences(text: string): { construct: string; value: string }[] {
    const attributes = ATTRIBUTE_MARKERS.flatMap((marker) => attributeValues(text, marker)).map((value) => ({
        construct: "html src/href",
        value,
    }));
    const urls = urlValues(text).map((value) => ({ construct: "css url()", value }));
    return [...attributes, ...urls];
};

const scanMarkup = function scanMarkup(file: string, rel: string): ReferenceFinding[] {
    if (!MARKUP_EXTENSIONS.has(path.extname(file).toLowerCase())) {
        return [];
    }
    return markupReferences(readText(file))
        .map((hit) => ({ construct: hit.construct, file: rel, token: tokenIn(hit.value), value: hit.value }))
        .filter((finding): finding is ReferenceFinding => finding.token !== null);
};

export const collectReferenceFindings = function collectReferenceFindings(): ReferenceFinding[] {
    return walk(ROOT)
        .flatMap((file) => scanMarkup(file, path.relative(ROOT, file).split(path.sep).join("/")))
        .toSorted((a, b) => a.file.localeCompare(b.file) || a.value.localeCompare(b.value));
};
