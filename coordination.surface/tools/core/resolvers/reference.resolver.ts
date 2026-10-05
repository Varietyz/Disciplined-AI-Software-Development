import { DIGEST_ROOT, INTEL_ROOT } from "../constants/template.constants.ts";
import { citationKindUnknown, citationUnresolved, citationUntyped } from "../strings/reference.strings.ts";

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { BEHAVIOR_DOCUMENT } from "../constants/path.constants.ts";
import type { Citation } from "../types/reference.types.ts";
import { join } from "node:path";
import { surfacePath } from "../../../config/surface.config.ts";

const RULES_DIR = DIGEST_ROOT;

const ENTRYPOINT_ROOT = surfacePath("entrypoints");

const WRITE_ENTRYPOINT = "board.entrypoint.ts";
const PLANNING_DIR = surfacePath("planning");
const RULE_SOURCES = surfacePath("rules");
const RECORD_SOURCES = INTEL_ROOT;
const RULE_SUFFIX = ".rule.ts";

const joinedDirectory = function joinedDirectory(root: string, relative: string): string {
    const directory = join(root, relative);
    if (!existsSync(directory)) {
        return "";
    }

    let held = "";
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
        if (!entry.isFile()) {
            continue;
        }
        held += readFileSync(join(directory, entry.name), "utf8");
    }
    return held;
};

const registeredGates = function registeredGates(root: string): string[] {
    const directory = join(root, RULE_SOURCES);
    if (!existsSync(directory)) {
        return [];
    }

    const ids: string[] = [];
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
        if (!entry.isFile() || !entry.name.endsWith(RULE_SUFFIX)) {
            continue;
        }
        ids.push(entry.name.slice(0, entry.name.length - RULE_SUFFIX.length));
    }
    return ids;
};

const beforeSlash = function beforeSlash(member: string): string {
    const slash = member.indexOf("/");
    return slash === -1 ? member : member.slice(0, slash);
};

const FLAG_OPEN = '"--';

const FLAG_CLOSE = '"';

const isFlagCharacter = function isFlagCharacter(character: string): boolean {
    const lower = character >= "a" && character <= "z";
    return lower || character === "-";
};

export const offeredForms = function offeredForms(root: string): string[] {
    const entrypoint = join(root, ENTRYPOINT_ROOT, WRITE_ENTRYPOINT);
    if (!existsSync(entrypoint)) {
        return [];
    }

    const source = readFileSync(entrypoint, "utf8");
    const out: string[] = [];
    let open = source.indexOf(FLAG_OPEN);

    while (open !== -1) {
        let cursor = open + 1;
        while (cursor < source.length && isFlagCharacter(source.charAt(cursor))) {
            cursor += 1;
        }

        const flag = source.slice(open + 1, cursor);
        if (cursor > open + FLAG_OPEN.length && source.charAt(cursor) === FLAG_CLOSE && !out.includes(flag)) {
            out.push(flag);
        }
        open = source.indexOf(FLAG_OPEN, open + FLAG_OPEN.length);
    }

    return out;
};

export const resolvesCitation = function resolvesCitation(root: string, archive: string, citation: Citation): boolean {
    if (citation.kind === "changelog") {
        return archive.includes(citation.member);
    }

    if (citation.kind === "rule") {
        const behavior = join(root, BEHAVIOR_DOCUMENT);
        const held = (existsSync(behavior) ? readFileSync(behavior, "utf8") : "") + joinedDirectory(root, RULES_DIR);
        return held.includes(citation.member);
    }

    if (citation.kind === "gate") {
        return registeredGates(root).includes(beforeSlash(citation.member));
    }

    if (citation.kind === "row") {
        return joinedDirectory(root, PLANNING_DIR).includes(citation.member);
    }

    if (citation.kind === "record") {
        return joinedDirectory(root, RECORD_SOURCES).includes(citation.member);
    }

    if (citation.kind === "form") {
        return offeredForms(root).includes(citation.member);
    }

    return false;
};

export const CITATION_KINDS = ["gate", "row", "rule", "record", "changelog", "form"];

const SEPARATOR = ":";

export const parseCitation = function parseCitation(text: string): Citation | null {
    const at = text.indexOf(SEPARATOR);
    if (at <= 0) {
        return null;
    }

    const kind = text.slice(0, at).trim();
    const member = text.slice(at + 1).trim();
    if (kind.length === 0 || member.length === 0) {
        return null;
    }

    return { kind, member };
};

export const unknownKind = function unknownKind(citation: Citation): boolean {
    return !CITATION_KINDS.includes(citation.kind);
};

export const citationRefusal = function citationRefusal(
    text: string,
    resolves: (citation: Citation) => boolean,
): string | null {
    const citation = parseCitation(text);

    if (citation === null) {
        return citationUntyped(text, CITATION_KINDS);
    }

    if (unknownKind(citation)) {
        return citationKindUnknown(citation.kind, CITATION_KINDS);
    }

    if (resolves(citation)) {
        return null;
    }

    return citationUnresolved(citation.kind, citation.member);
};
