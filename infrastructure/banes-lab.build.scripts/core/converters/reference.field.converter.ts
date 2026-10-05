import type { ReferenceRecord, ReferenceRelation } from "@banes-lab/web/types/reference.types.js";
import type { EdgeRef } from "@banes-lab/web/types/link.types.js";
import { isRecord } from "#core/selectors/base.selector";

const HYPHEN = "-";
const UNDERSCORE = "_";
const SPACE = " ";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SKIPPED_FIELDS: ReadonlySet<string> = new Set(["anchor", "id"]);
const SUMMARY_FIELDS: readonly string[] = [
    "question",
    "statement",
    "practice",
    "expression",
    "viewpoint",
    "studies",
    "decisionTest",
    "predicateExpression",
    "mathNature",
    "nature",
    "predicateFamily",
    "role",
    "principle",
];

const isEdgeRef = function isEdgeRef(value: unknown): value is EdgeRef {
    return isRecord(value) && typeof value["label"] === "string" && "ref" in value;
};

const isEdgeList = function isEdgeList(value: unknown): value is readonly EdgeRef[] {
    return Array.isArray(value) && value.length > 0 && value.every(isEdgeRef);
};

const kebabOf = function kebabOf(name: string): string {
    let out = "";
    for (const char of name) {
        out += UPPER.includes(char) ? HYPHEN + char.toLowerCase() : char;
    }
    return out;
};

const fieldsOf = function fieldsOf(view: object): readonly (readonly [string, unknown])[] {
    return Object.entries(view);
};

const summaryOf = function summaryOf(view: object): string | null {
    const held = new Map(fieldsOf(view));
    for (const field of SUMMARY_FIELDS) {
        const value = held.get(field);
        if (typeof value === "string" && value.length > 0) {
            return value;
        }
    }
    return null;
};

export const hyphenatedOf = function hyphenatedOf(id: string): string {
    return id.split(UNDERSCORE).join(HYPHEN);
};

export const titleOf = function titleOf(id: string): string {
    return id
        .split(HYPHEN)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(SPACE);
};

export const relationsOf = function relationsOf(view: object): readonly ReferenceRelation[] {
    return fieldsOf(view).flatMap(([field, value]) => {
        if (SKIPPED_FIELDS.has(field)) {
            return [];
        }
        if (isEdgeRef(value)) {
            return [{ edges: [value], relation: kebabOf(field) }];
        }
        return isEdgeList(value) ? [{ edges: value, relation: kebabOf(field) }] : [];
    });
};

export const nameOf = function nameOf(view: object, id: string): string {
    const name = new Map(fieldsOf(view)).get("name");
    return typeof name === "string" && name.length > 0 ? name : titleOf(id);
};

export const recordOf = function recordOf(view: object, kind: string, name: string): ReferenceRecord {
    return { code: null, kind, layer: null, name, relations: relationsOf(view), summary: summaryOf(view) };
};
