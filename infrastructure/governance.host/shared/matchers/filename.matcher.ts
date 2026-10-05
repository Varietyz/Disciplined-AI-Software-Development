import type { ExemptName, ParseFailure, ParseResult, ParsedName } from "../../types/taxonomy.types.ts";
import { ambiguousCoordinate, noSplitter, unresolvedCoordinate } from "../strings/taxonomy.strings.ts";
import {
    isCompoundMarker,
    isConcern,
    isDeclaredSubject,
    isDeclaredVariant,
    isLegalSubject,
    splitterFor,
    vocabularyFor,
} from "../manifests/taxonomy.manifest.ts";
import { slotWordOf, wordsOf } from "./segment.matcher.ts";

const KEBAB_EXTRA = "-";

const KEBAB_CASE = "kebab";

const isKebabChar = function isKebabChar(char: string): boolean {
    const isLower = char >= "a" && char <= "z";
    const isDigit = char >= "0" && char <= "9";
    return isLower || isDigit || char === KEBAB_EXTRA;
};

const hasKebabEdges = function hasKebabEdges(word: string): boolean {
    if (word === "" || word.startsWith(KEBAB_EXTRA) || word.endsWith(KEBAB_EXTRA)) {
        return false;
    }
    return !word.includes(`${KEBAB_EXTRA}${KEBAB_EXTRA}`);
};

export const isKebab = function isKebab(word: string, root?: string): boolean {
    if (vocabularyFor(root).case !== KEBAB_CASE) {
        return true;
    }
    if (!hasKebabEdges(word)) {
        return false;
    }
    for (let at = 0; at < word.length; at += 1) {
        if (!isKebabChar(word.charAt(at))) {
            return false;
        }
    }
    return true;
};

const slotBounds = function slotBounds(root: string | undefined): { min: number; max: number } {
    const vocabulary = vocabularyFor(root);
    const counts = vocabulary.fileShapes.map((shape) => shape.split(vocabulary.separator).length);
    return { max: Math.max(...counts), min: Math.min(...counts) };
};

const shapeError = function shapeError(
    basename: string,
    segments: readonly string[],
    concern: string,
    root: string | undefined,
): ParseFailure | null {
    const shapes = vocabularyFor(root).fileShapes;
    const { max, min } = slotBounds(root);
    if (segments.length < min) {
        return { reason: `a governed file needs at least ${shapes[0] ?? ""}`, word: basename };
    }
    if (segments.length > max) {
        return { reason: `more slots than the grammar allows (${shapes.join(" | ")})`, word: basename };
    }
    if (!isConcern(concern, root)) {
        return { reason: "last segment before the extension is not a declared concern tag", word: concern };
    }
    return null;
};

const slotError = function slotError(
    slots: { subject: string; variant: string | null; concern: string },
    root: string | undefined,
): ParseFailure | null {
    const { concern, subject, variant } = slots;
    if (!isLegalSubject(subject, root)) {
        return { reason: "subject is neither a declared subject nor a concern tag", word: subject };
    }
    if (subject === concern) {
        return { reason: "subject must not equal concern; the subject is carrying no information", word: subject };
    }
    if (variant !== null && !isDeclaredVariant(variant, root) && !isDeclaredSubject(variant, root)) {
        return { reason: "variant is neither a declared variant nor a declared subject", word: variant };
    }
    const offending = (variant === null ? [subject] : [subject, variant]).find((slot) => !isKebab(slot, root));
    return offending === undefined ? null : { reason: `slot is not ${vocabularyFor(root).case}-case`, word: offending };
};

const concernRunOf = function concernRunOf(words: readonly string[], root: string | undefined): number {
    for (let take = words.length - 1; take >= 1; take -= 1) {
        if (isConcern(slotWordOf(words.slice(-take)), root)) {
            return take;
        }
    }
    return 0;
};

const headSlotsOf = function headSlotsOf(
    head: readonly string[],
    root: string | undefined,
): { subject: string; variant: string | null } | null {
    const whole = slotWordOf(head);
    if (isLegalSubject(whole, root)) {
        return { subject: whole, variant: null };
    }
    for (let take = head.length - 1; take >= 1; take -= 1) {
        const subject = slotWordOf(head.slice(0, take));
        const variant = slotWordOf(head.slice(take));
        if (isLegalSubject(subject, root) && (isDeclaredVariant(variant, root) || isDeclaredSubject(variant, root))) {
            return { subject, variant };
        }
    }
    return null;
};

export const parseDialect = function parseDialect(basename: string, splitterName: string, root?: string): ParseResult {
    const { separator, splitters } = vocabularyFor(root);
    const splitter = splitters.get(splitterName);
    if (splitter === undefined) {
        throw new Error(noSplitter(splitterName));
    }
    const cut = basename.lastIndexOf(separator);
    const stem = cut === -1 ? basename : basename.slice(0, cut);
    const ext = cut === -1 ? "" : basename.slice(cut + 1);
    const words = wordsOf(stem, splitter);
    if (words === null) {
        return { reason: `a ${splitterName} dialect file is one ${splitterName} word run`, word: basename };
    }
    const marker = words.at(-1) ?? "";
    if (isCompoundMarker(marker, root)) {
        return { exempt: true, marker };
    }
    const taken = concernRunOf(words, root);
    if (taken === 0) {
        return { reason: "the trailing words are not a declared concern tag", word: marker };
    }
    const concern = slotWordOf(words.slice(-taken));
    const slots = headSlotsOf(words.slice(0, -taken), root);
    if (slots === null) {
        const head = slotWordOf(words.slice(0, -taken));
        return {
            reason: "the leading words are neither a legal subject nor a subject and a declared variant",
            word: head,
        };
    }
    return slotError({ concern, ...slots }, root) ?? { concern, ext, ...slots };
};

export const parseFilename = function parseFilename(basename: string, root?: string): ParseResult {
    const segments = basename.split(vocabularyFor(root).separator);
    const ext = segments.at(-1) ?? "";
    const splitter = splitterFor(ext, root);
    if (splitter !== null) {
        return parseDialect(basename, splitter.name, root);
    }
    const concern = segments.at(-2) ?? "";

    if (isCompoundMarker(concern, root)) {
        return { exempt: true, marker: concern };
    }
    const shape = shapeError(basename, segments, concern, root);
    if (shape !== null) {
        return shape;
    }

    const head = segments.slice(0, -2);
    const subject = head[0] ?? "";
    const variant = head.length === 2 ? (head[1] ?? "") : null;

    const slot = slotError({ concern, subject, variant }, root);
    return slot ?? { concern, ext, subject, variant };
};

export const isExempt = function isExempt(result: ParseResult): result is ExemptName {
    return Object.hasOwn(result, "exempt");
};

export const isParsed = function isParsed(result: ParseResult): result is ParsedName {
    return Object.hasOwn(result, "concern");
};

export const hasConcern = function hasConcern(basename: string, tag: string): boolean {
    const parsed = parseFilename(basename);
    return isParsed(parsed) && parsed.concern === tag;
};

export const filesWithConcern = function filesWithConcern(tag: string, files: readonly string[]): string[] {
    return files.filter((file) => hasConcern(file.slice(file.lastIndexOf("/") + 1), tag));
};

export const resolveFile = function resolveFile(subject: string, tag: string, files: readonly string[]): string {
    const matches = filesWithConcern(tag, files).filter((file) => {
        const basename = file.slice(file.lastIndexOf("/") + 1);
        return basename.slice(0, basename.indexOf(".")) === subject;
    });
    const [first] = matches;
    if (first === undefined) {
        throw new Error(unresolvedCoordinate(subject, tag));
    }
    if (matches.length > 1) {
        throw new Error(ambiguousCoordinate(subject, tag, matches));
    }
    return first;
};
