import {
    EVIDENCE_IN_BOTH,
    EVIDENCE_IN_NEITHER,
    LEAF_REVERSE_MESSAGES,
    NO_CLOSURE_REPORT,
    missingReverse,
    noLeafReverseMessage,
    unresolvedLink,
} from "#configuration/strings/link.strings";
import {
    EVIDENCE_RELATION_ID,
    LEAF_RELATIONS,
    LINKED_FROM_RELATION,
    isListingRef,
} from "@banes-lab/web/constants/graph.constants";
import { existsSync, readFileSync } from "node:fs";
import { fileOfAddress, localAddress } from "#core/resolvers/catalog.resolver";
import type { Finding } from "#types/validation.types";
import { JSON_ROUTE } from "#configuration/constants/site.constants";
import type { Unresolved } from "#types/catalog.types";
import { isRecord } from "#core/selectors/base.selector";
import { join } from "node:path";
import { relationLabelOf } from "@banes-lab/web/strings/reference.strings";
import { walk } from "#core/loaders/asset.loader";

const JSON_EXTENSION = ".json";

interface Edge {
    readonly json: string | null;
    readonly ref: string | null;
}

interface Reverse {
    readonly forward: string;
    readonly message: (target: string) => string;
    readonly reverse: string;
}

const REVERSES: readonly Reverse[] = LEAF_RELATIONS.map((relation) => {
    const message = LEAF_REVERSE_MESSAGES.get(relation.forward);
    if (message === undefined) {
        throw new Error(noLeafReverseMessage(relation.forward));
    }
    return { forward: relation.forward, message, reverse: relation.reverse };
});

const LEAF_PAIRED: ReadonlySet<string> = new Set(REVERSES.flatMap((pair) => [pair.forward, pair.reverse]));

interface HeldRelation {
    readonly edges: readonly Edge[];
    readonly relation: string;
}

type Leaves = ReadonlyMap<string, Record<string, unknown>>;

const isNullableText = function isNullableText(value: unknown): boolean {
    return value === null || typeof value === "string";
};

const isUnresolved = function isUnresolved(value: unknown): value is Unresolved {
    return (
        isRecord(value) &&
        typeof value["label"] === "string" &&
        typeof value["target"] === "string" &&
        isNullableText(value["from"])
    );
};

export const closureFindings = function closureFindings(report: string): Finding[] {
    if (!existsSync(report)) {
        return [{ file: report, message: NO_CLOSURE_REPORT }];
    }
    const parsed: unknown = JSON.parse(readFileSync(report, "utf8"));
    const rows = Array.isArray(parsed) ? parsed.filter(isUnresolved) : [];
    return rows.map((row) => ({ file: row.from ?? row.target, message: unresolvedLink(row.label, row.target) }));
};

const edgesIn = function edgesIn(value: unknown): readonly Edge[] {
    return Array.isArray(value)
        ? value
              .filter(isRecord)
              .map((edge) => ({
                  json: typeof edge["json"] === "string" ? edge["json"] : null,
                  ref: typeof edge["ref"] === "string" ? edge["ref"] : null,
              }))
        : [];
};

const leavesOf = function leavesOf(outDir: string): Leaves {
    const folder = join(outDir, JSON_ROUTE.slice(1));
    if (!existsSync(folder)) {
        return new Map();
    }
    return new Map(
        walk(outDir, folder)
            .filter((file) => file.endsWith(JSON_EXTENSION))
            .flatMap((file) => {
                const parsed: unknown = JSON.parse(readFileSync(join(outDir, file), "utf8"));
                return isRecord(parsed) && typeof parsed["ref"] === "string" ? [[file, parsed] as const] : [];
            }),
    );
};

const targetOf = function targetOf(edge: Edge, leaves: Leaves, site: string): Record<string, unknown> | undefined {
    return edge.json === null ? undefined : leaves.get(fileOfAddress(localAddress(site, edge.json)));
};

const relationsIn = function relationsIn(value: unknown): readonly HeldRelation[] {
    return Array.isArray(value)
        ? value
              .filter(isRecord)
              .map((held) => ({
                  edges: edgesIn(held["links"]),
                  relation: typeof held["relation"] === "string" ? held["relation"] : "",
              }))
        : [];
};

const groupOf = function groupOf(leaf: Record<string, unknown>, relation: string): readonly Edge[] {
    return relationsIn(leaf["relations"])
        .filter((held) => held.relation === relation)
        .flatMap((held) => held.edges);
};

const reverseFindings = function reverseFindings(
    file: string,
    leaf: Record<string, unknown>,
    leaves: Leaves,
    site: string,
): Finding[] {
    return REVERSES.flatMap((pair) =>
        groupOf(leaf, pair.forward).flatMap((edge) => {
            const target = targetOf(edge, leaves, site);
            if (target === undefined) {
                return [];
            }
            const back = groupOf(target, pair.reverse).some((reverse) => reverse.ref === leaf["ref"]);
            return back ? [] : [{ file, message: pair.message(edge.ref ?? edge.json ?? "") }];
        }),
    );
};

const recordFindings = function recordFindings(
    file: string,
    leaf: Record<string, unknown>,
    leaves: Leaves,
    site: string,
): Finding[] {
    return relationsIn(leaf["relations"])
        .filter((held) => !LEAF_PAIRED.has(held.relation))
        .flatMap((held) =>
            held.edges.flatMap((edge) => {
                const target = targetOf(edge, leaves, site);
                if (target === undefined || !Array.isArray(target["relations"])) {
                    return [];
                }
                const back = relationsIn(target["relations"]).some((reverse) =>
                    reverse.edges.some((listed) => listed.ref === leaf["ref"]),
                );
                const label = relationLabelOf(held.relation);
                return back ? [] : [{ file, message: missingReverse(label, edge.ref ?? edge.json ?? "") }];
            }),
        );
};

const groundingFindings = function groundingFindings(
    file: string,
    leaf: Record<string, unknown>,
    absent: ReadonlySet<string>,
): Finding[] {
    const ref = String(leaf["ref"]);
    const grounded = groupOf(leaf, EVIDENCE_RELATION_ID).length > 0;
    if (grounded && absent.has(ref)) {
        return [{ file, message: EVIDENCE_IN_BOTH }];
    }
    const named =
        groupOf(leaf, LINKED_FROM_RELATION).some((edge) => edge.ref !== null && !isListingRef(edge.ref)) &&
        leaf["collection"] !== undefined;
    return named && !grounded && !absent.has(ref) ? [{ file, message: EVIDENCE_IN_NEITHER }] : [];
};

export const lookbackFindings = function lookbackFindings(
    outDir: string,
    site: string,
    absent: ReadonlySet<string>,
): Finding[] {
    const leaves = leavesOf(outDir);
    return [...leaves.entries()].flatMap(([file, leaf]) => [
        ...reverseFindings(file, leaf, leaves, site),
        ...recordFindings(file, leaf, leaves, site),
        ...groundingFindings(file, leaf, absent),
    ]);
};
