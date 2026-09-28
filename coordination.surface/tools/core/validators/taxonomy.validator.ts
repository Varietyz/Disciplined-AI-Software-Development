import type { NamingCode, ParsedName, PlacementCode, Role, TaxonomyData } from "../types/taxonomy.types.ts";

const ACCUMULATOR_PREFIX = "_";

const ENTRY_DOCUMENT = "README.md";

const SEPARATOR = ".";

const MINIMUM_PARTS = 3;

const MARKED_PARTS = 4;

type ParseOutcome =
    { readonly code: NamingCode; readonly parsed: null } | { readonly code: null; readonly parsed: ParsedName };

const slot = function slot(parts: readonly string[], index: number): string {
    return parts[index] ?? "";
};

const refused = function refused(code: NamingCode): ParseOutcome {
    return { code, parsed: null };
};

const parsedAs = function parsedAs(parsed: ParsedName): ParseOutcome {
    return { code: null, parsed };
};

const markedName = function markedName(parts: readonly string[], marker: string): ParseOutcome {
    if (parts.length < MARKED_PARTS) {
        return refused("unparsable");
    }
    return parsedAs({
        concern: slot(parts, parts.length - 3),
        ext: slot(parts, parts.length - 1),
        marker,
        subject: parts.slice(0, -3).join(SEPARATOR),
        variant: null,
    });
};

export const parseFilename = function parseFilename(name: string, data: TaxonomyData): ParseOutcome {
    const parts = name.split(SEPARATOR);
    if (parts.length < MINIMUM_PARTS) {
        return refused("unparsable");
    }

    const concern = slot(parts, parts.length - 2);
    if (data.compoundMarkers.includes(concern)) {
        return markedName(parts, concern);
    }

    const subject = slot(parts, 0);
    if (subject === concern) {
        return refused("subjectEqualsConcern");
    }

    const variant = parts.length >= MARKED_PARTS ? parts.slice(1, -2).join(SEPARATOR) : null;
    return parsedAs({ concern, ext: slot(parts, parts.length - 1), marker: null, subject, variant });
};

const isLegalSubject = (word: string, data: TaxonomyData): boolean =>
    data.subjects.includes(word) || data.concernTags.includes(word);

const isLegalVariant = (word: string, data: TaxonomyData): boolean =>
    data.variants.includes(word) || data.subjects.includes(word) || data.agentLetters.includes(word);

interface NamingVerdict {
    readonly ok: boolean;
    readonly code: NamingCode | null;
    readonly evidence: string;
}

const undeclaredSlot = function undeclaredSlot(parsed: ParsedName, data: TaxonomyData): string | null {
    if (!isLegalSubject(parsed.subject, data)) {
        return `subject "${parsed.subject}"`;
    }
    if (parsed.variant !== null && !isLegalVariant(parsed.variant, data)) {
        return `variant "${parsed.variant}"`;
    }
    return data.concernTags.includes(parsed.concern) ? null : `concern "${parsed.concern}"`;
};

export const checkNaming = function checkNaming(name: string, parentFolder: string, data: TaxonomyData): NamingVerdict {
    const outcome = parseFilename(name, data);
    if (outcome.parsed === null) {
        return { code: outcome.code, evidence: name, ok: false };
    }

    const { parsed } = outcome;
    const undeclared = undeclaredSlot(parsed, data);
    if (undeclared !== null) {
        return { code: "undeclaredSlot", evidence: undeclared, ok: false };
    }

    const expected = data.folderToTag[parentFolder];
    if (expected === undefined) {
        return { code: "concernMismatch", evidence: `parent "${parentFolder}" is not a concern folder`, ok: false };
    }
    if (expected !== parsed.concern) {
        return {
            code: "concernMismatch",
            evidence: `tag "${parsed.concern}" against folder "${parentFolder}" expecting "${expected}"`,
            ok: false,
        };
    }

    return { code: null, evidence: "", ok: true };
};

const ROLE_ORDER: readonly Role[] = ["container", "subject", "concern"];

interface PlacementVerdict {
    readonly ok: boolean;
    readonly code: PlacementCode | null;
    readonly evidence: string;
    readonly concernFolder: string | null;
    readonly foreign?: boolean;
}

const failed = function failed(code: PlacementCode, evidence: string): PlacementVerdict {
    return { code, concernFolder: null, evidence, ok: false };
};

const placed = function placed(concernFolder: string): PlacementVerdict {
    return { code: null, concernFolder, evidence: "", ok: true };
};

const foreignTo = function foreignTo(evidence: string): PlacementVerdict {
    return { code: null, concernFolder: null, evidence, foreign: true, ok: true };
};

const isRootSpine = function isRootSpine(fileName: string): boolean {
    return fileName.startsWith(ACCUMULATOR_PREFIX) || fileName === ENTRY_DOCUMENT;
};

const roleOf = function roleOf(folder: string, data: TaxonomyData): Role | null {
    if (data.concernFolders.includes(folder)) {
        return "concern";
    }
    return data.subjects.includes(folder) ? "subject" : null;
};

const roleVerdict = function roleVerdict(rest: readonly string[], data: TaxonomyData): PlacementVerdict {
    let consumed = 0;
    for (const folder of rest) {
        const role = roleOf(folder, data);
        const index = role === null ? -1 : ROLE_ORDER.indexOf(role);
        if (role === null) {
            return failed("badShape", folder);
        }
        if (index <= consumed) {
            return failed("roleOutOfOrder", `${folder} as ${role}`);
        }
        consumed = index;
    }

    const parent = slot(rest, rest.length - 1);
    return data.concernFolders.includes(parent) ? placed(parent) : failed("parentNotConcern", parent);
};

const containerVerdict = function containerVerdict(
    segments: readonly string[],
    container: string,
    isBucket: boolean,
    data: TaxonomyData,
): PlacementVerdict {
    const rest = segments.slice(1);
    const dotted = segments.find((folder) => folder.includes(SEPARATOR));
    if (dotted !== undefined) {
        return failed("dottedFolder", dotted);
    }
    if (isBucket) {
        return rest.length > 0 ? failed("nestedInSpecial", `${container}/${slot(rest, 0)}`) : placed(container);
    }
    if (rest.length === 0) {
        return failed("looseFileAtRoot", container);
    }
    return segments.length > data.maxDepthFromRoot ? failed("tooDeep", segments.join("/")) : roleVerdict(rest, data);
};

export const checkPlacement = function checkPlacement(
    root: string,
    segments: readonly string[],
    data: TaxonomyData,
    fileName = "",
): PlacementVerdict {
    if (segments.length === 0) {
        return isRootSpine(fileName) ? foreignTo(root) : failed("looseFileAtRoot", root);
    }

    const container = slot(segments, 0);
    if ((data.foreignContainers[root] ?? []).includes(container)) {
        return foreignTo(container);
    }

    const isBucket = (data.specialContainers[root] ?? []).includes(container);
    if (!isBucket && !(data.containers[root] ?? []).includes(container)) {
        return failed("undeclaredContainer", container);
    }

    return containerVerdict(segments, container, isBucket, data);
};
