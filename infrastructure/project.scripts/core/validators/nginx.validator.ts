import {
    COMMENT_MARK,
    ENGINE_DIRECTIVE,
    ESCAPE,
    IMPORT_DIRECTIVE,
    QUOTES,
    REQUIRED_ENGINE,
    TERMINATOR,
    TOKEN_BOUNDARIES,
} from "#configuration/constants/nginx.constants";
import {
    COMMENT_REMEDY,
    ENGINE_MISSING,
    ENGINE_REMEDY,
    commentsHeading,
    commentsHeld,
    engineHeading,
    engineHeld,
    otherEngine,
} from "#configuration/strings/nginx.strings";
import type { CheckVerdict } from "#types/validation.types";
import type { ConfigFile } from "#types/nginx.types";

const NEWLINE = "\n";
const SPACE = " ";

const opensComment = function opensComment(line: string, at: number): boolean {
    return at === 0 || TOKEN_BOUNDARIES.has(line.charAt(at - 1));
};

const quoteAfter = function quoteAfter(quote: string, char: string): string {
    if (quote !== "") {
        return char === quote ? "" : quote;
    }
    return QUOTES.has(char) ? char : "";
};

const hasComment = function hasComment(line: string): boolean {
    let quote = "";
    for (let at = 0; at < line.length; at += 1) {
        const char = line.charAt(at);
        if (char === ESCAPE) {
            at += 1;
        } else if (quote === "" && char === COMMENT_MARK && opensComment(line, at)) {
            return true;
        } else {
            quote = quoteAfter(quote, char);
        }
    }
    return false;
};

export const commentVerdict = function commentVerdict(files: readonly ConfigFile[]): CheckVerdict {
    const found = files.flatMap((file) =>
        file.text
            .split(NEWLINE)
            .flatMap((line, index) => (hasComment(line) ? [`  ${file.path}:${String(index + 1)}`] : [])),
    );
    if (found.length === 0) {
        return { held: true, text: commentsHeld(files.length) };
    }
    return { held: false, text: [commentsHeading(found.length), ...found, COMMENT_REMEDY, ""].join(NEWLINE) };
};

const directivesOf = function directivesOf(text: string): readonly (readonly string[])[] {
    return text
        .split(NEWLINE)
        .map((line) => line.trim())
        .filter((line) => line.endsWith(TERMINATOR))
        .map((line) =>
            line
                .slice(0, -TERMINATOR.length)
                .split(SPACE)
                .filter((word) => word.length > 0),
        );
};

const engineFinding = function engineFinding(text: string): string | null {
    const directives = directivesOf(text);
    if (!directives.some((words) => words[0] === IMPORT_DIRECTIVE)) {
        return null;
    }
    const engines = directives.filter((words) => words[0] === ENGINE_DIRECTIVE).map((words) => words[1] ?? "");
    if (engines.length === 0) {
        return ENGINE_MISSING;
    }
    const other = engines.find((engine) => engine !== REQUIRED_ENGINE);
    return other === undefined ? null : otherEngine(other);
};

export const engineVerdict = function engineVerdict(files: readonly ConfigFile[]): CheckVerdict {
    const found = files.flatMap((file) => {
        const finding = engineFinding(file.text);
        return finding === null ? [] : [`  ${file.path} ${finding}`];
    });
    if (found.length === 0) {
        return { held: true, text: engineHeld(files.length) };
    }
    return { held: false, text: [engineHeading(found.length), ...found, ENGINE_REMEDY, ""].join(NEWLINE) };
};
