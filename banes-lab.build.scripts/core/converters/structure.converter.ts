import type { AnatomySlots, AnatomyStats } from "@banes-lab/web/types/anatomy.types.js";
import { isConcern, isNameExempt, layerFor, tagForFolder } from "@ssot/govlab/shared/manifests/taxonomy.manifest.ts";
import type { DiskFolder } from "#types/structure.types";

const NAME_SEPARATOR = ".";
const MIN_SLOT_SEGMENTS = 3;
const ROLE_CONCERN = "concern";

export const slotsOf = function slotsOf(name: string, root?: string): AnatomySlots | null {
    if (isNameExempt(name, root)) {
        return null;
    }
    const segments = name.split(NAME_SEPARATOR);
    const concern = segments.at(-2) ?? "";
    const subject = segments[0] ?? "";
    if (segments.length < MIN_SLOT_SEGMENTS || !isConcern(concern, root) || subject === "") {
        return null;
    }
    const middle = segments.slice(1, -2);
    return { concern, subject, variant: middle.length === 0 ? null : middle.join(NAME_SEPARATOR) };
};

export const fileLayerOf = function fileLayerOf(slots: AnatomySlots | null, root?: string): string | null {
    return slots === null ? null : (layerFor(slots.concern, root) ?? null);
};

export const folderLayerOf = function folderLayerOf(folder: DiskFolder): string | null {
    if (folder.role !== ROLE_CONCERN) {
        return null;
    }
    const tag = tagForFolder(folder.name, folder.governedBy);
    return tag === undefined ? null : (layerFor(tag, folder.governedBy) ?? null);
};

const tallyInto = function tallyInto(
    into: Record<string, number>,
    from: Readonly<Record<string, number>>,
): Record<string, number> {
    for (const [key, count] of Object.entries(from)) {
        into[key] = (into[key] ?? 0) + count;
    }
    return into;
};

export const sumStats = function sumStats(parts: readonly AnatomyStats[]): AnatomyStats {
    const flows: Record<string, number> = {};
    const findings: Record<string, number> = {};
    for (const part of parts) {
        tallyInto(flows, part.flows);
        tallyInto(findings, part.findings);
    }
    const total = function total(pick: (part: AnatomyStats) => number): number {
        return parts.reduce((sum, part) => sum + pick(part), 0);
    };
    return {
        bytes: total((part) => part.bytes),
        callable: total((part) => part.callable),
        definitions: total((part) => part.definitions),
        edges: total((part) => part.edges),
        exported: total((part) => part.exported),
        files: total((part) => part.files),
        findings,
        flows,
        lines: {
            blank: total((part) => part.lines.blank),
            code: total((part) => part.lines.code),
            total: total((part) => part.lines.total),
        },
    };
};
