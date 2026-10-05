import { SPINE_DETAILS, missingFrontmatterField } from "#configuration/strings/document.strings";
import type { SpineDefect, SpineOptions } from "#types/document.types";
import { parseFrontmatter } from "#core/parsers/metadata.parser";
import { splitLines } from "#core/parsers/markdown.parser";

const TITLE_PREFIX = "# ";
const SETEXT_CHAR = "=";

const isSetextUnderline = function isSetextUnderline(line: string): boolean {
    for (const char of line) {
        if (char !== SETEXT_CHAR) {
            return false;
        }
    }
    return line.length > 0;
};

const titleDefect = function titleDefect(source: string, bodyStart: number): SpineDefect | null {
    const lines = splitLines(source);
    let at = bodyStart;
    while (at < lines.length && (lines[at] ?? "").trim() === "") {
        at += 1;
    }
    const first = lines[at] ?? "";
    const setext = first.trim().length > 0 && isSetextUnderline((lines[at + 1] ?? "").trim());
    return first.startsWith(TITLE_PREFIX) || setext
        ? null
        : { code: "no-title", detail: SPINE_DETAILS.noTitle, line: at + 1 };
};

const missingFields = function missingFields(
    fields: Record<string, string>,
    requiredKeys: readonly string[],
): SpineDefect[] {
    return requiredKeys
        .filter((key) => (fields[key] ?? "") === "")
        .map((key): SpineDefect => ({ code: "missing-field", detail: missingFrontmatterField(key), line: 1 }));
};

export const validateSpine = function validateSpine(
    source: string,
    requiredKeys: readonly string[],
    options: SpineOptions = {},
): SpineDefect[] {
    const { requireFrontmatter = true, requireTitle = true } = options;
    const frontmatter = parseFrontmatter(source);
    if (!frontmatter.present && requireFrontmatter) {
        return [{ code: "no-frontmatter", detail: SPINE_DETAILS.noFrontmatter, line: 1 }];
    }
    const fieldDefects = frontmatter.present ? missingFields(frontmatter.fields, requiredKeys) : [];
    const title = requireTitle ? titleDefect(source, frontmatter.bodyStart) : null;
    return title === null ? fieldDefects : [...fieldDefects, title];
};
