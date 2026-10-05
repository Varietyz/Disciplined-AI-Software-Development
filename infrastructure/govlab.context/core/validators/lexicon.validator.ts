import type { Lexicon, PlacedFile, Term } from "#types/lexicon.types";
import {
    MALFORMED_RENAME,
    NO_EXAMPLE,
    NO_RENAME,
    STRAY_EXAMPLE,
    SUBJECT_CHANGED,
    UNNAMED_TAG,
    exampleFolderMismatch,
    exampleTagMismatch,
    misplacedExample,
    renameFromDeclaredTag,
    renameUncovered,
    undeclaredPlacement,
    undeclaredRefusal,
} from "#configuration/strings/lexicon.strings";
import { folderOfTerm, isMirrored, statesPlacement, statesRefusal, tagOfTerm } from "#core/selectors/lexicon.selector";
import { EXAMPLE_SHAPES } from "#configuration/constants/lexicon.constants";
import type { LexDefect } from "#types/validation.types";
import { placedFileOf } from "#core/matchers/filename.matcher";

const defect = function defect(term: Term, reason: string): LexDefect {
    return { id: term.id, reason };
};

const expectedFolder = function expectedFolder(
    term: Term,
    placed: PlacedFile,
    folderByTag: ReadonlyMap<string, string>,
): string | null {
    if (!isMirrored(term)) {
        return folderOfTerm(term);
    }
    return placed.variant === null ? null : (folderByTag.get(placed.variant) ?? null);
};

const placedDefects = function placedDefects(term: Term, folderByTag: ReadonlyMap<string, string>): LexDefect[] {
    if (term.example === undefined) {
        return [defect(term, NO_EXAMPLE)];
    }
    const placed = placedFileOf(term.example);
    if (placed === null) {
        return [defect(term, misplacedExample(term.example))];
    }
    const tag = tagOfTerm(term);
    const folder = expectedFolder(term, placed, folderByTag);
    if (tag === null || folder === null) {
        return [defect(term, UNNAMED_TAG)];
    }
    return [
        ...(placed.tag === tag ? [] : [defect(term, exampleTagMismatch(placed.tag, tag))]),
        ...(placed.folder === folder ? [] : [defect(term, exampleFolderMismatch(placed.folder, folder))]),
    ];
};

const coversOf = function coversOf(term: Term, lex: Lexicon): { tag: string; folder: string }[] {
    return term.seeAlso.flatMap((ref) => {
        const covering = lex.resolve(ref);
        const tag = covering === null ? null : tagOfTerm(covering);
        const folder = covering === null ? null : folderOfTerm(covering);
        return tag === null || folder === null ? [] : [{ folder, tag }];
    });
};

const renameDefects = function renameDefects(term: Term, lex: Lexicon, placedTags: ReadonlySet<string>): LexDefect[] {
    if (term.exemplar === undefined) {
        return [defect(term, NO_RENAME)];
    }
    const before = placedFileOf(term.exemplar.before);
    const after = placedFileOf(term.exemplar.after);
    if (before === null || after === null) {
        return [defect(term, MALFORMED_RENAME)];
    }
    const covered = coversOf(term, lex).some((cover) => cover.tag === after.tag && cover.folder === after.folder);
    return [
        ...(before.subject === after.subject ? [] : [defect(term, SUBJECT_CHANGED)]),
        ...(placedTags.has(before.tag) ? [defect(term, renameFromDeclaredTag(before.tag))] : []),
        ...(covered ? [] : [defect(term, renameUncovered(after.folder, after.tag))]),
    ];
};

const carriesStray = function carriesStray(term: Term): boolean {
    if (term.exampleShape === EXAMPLE_SHAPES.placed) {
        return term.exemplar !== undefined;
    }
    if (term.exampleShape === EXAMPLE_SHAPES.renamed) {
        return term.example !== undefined;
    }
    return term.example !== undefined || term.exemplar !== undefined;
};

const undeclaredDefects = function undeclaredDefects(term: Term): LexDefect[] {
    return [
        ...(statesPlacement(term) && term.exampleShape !== EXAMPLE_SHAPES.placed
            ? [defect(term, undeclaredPlacement(EXAMPLE_SHAPES.placed))]
            : []),
        ...(statesRefusal(term) && term.exampleShape !== EXAMPLE_SHAPES.renamed
            ? [defect(term, undeclaredRefusal(EXAMPLE_SHAPES.renamed))]
            : []),
    ];
};

const folderByTagOf = function folderByTagOf(placedTerms: readonly Term[]): ReadonlyMap<string, string> {
    return new Map(
        placedTerms.flatMap((term): [string, string][] => {
            const tag = tagOfTerm(term);
            const folder = folderOfTerm(term);
            return tag === null || folder === null ? [] : [[tag, folder]];
        }),
    );
};

export const tagExampleDefectsOf = function tagExampleDefectsOf(lex: Lexicon): LexDefect[] {
    const terms = lex.all();
    const placedTerms = terms.filter((term) => term.exampleShape === EXAMPLE_SHAPES.placed);
    const placedTags = new Set(placedTerms.flatMap((term) => tagOfTerm(term) ?? []));
    const folderByTag = folderByTagOf(placedTerms);
    return terms.flatMap((term) => [
        ...undeclaredDefects(term),
        ...(carriesStray(term) ? [defect(term, STRAY_EXAMPLE)] : []),
        ...(term.exampleShape === EXAMPLE_SHAPES.placed ? placedDefects(term, folderByTag) : []),
        ...(term.exampleShape === EXAMPLE_SHAPES.renamed ? renameDefects(term, lex, placedTags) : []),
    ]);
};
