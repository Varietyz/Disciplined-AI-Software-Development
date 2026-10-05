import { CANON_CLEAN, CANON_REPORT_ONLY, canonFailed, canonReport } from "#configuration/strings/canon.strings";
import { FAILURE_EXIT, FLAGS } from "#configuration/constants/invocation.constants";
import { canonicalizeId, canonicalizeKind, isCanonicalId, isCanonicalKind } from "#core/converters/canon.converter";
import { hasFlag, resolveArgv } from "@govlab/argv";
import { readFileSync, readdirSync } from "node:fs";
import { recordsAt, stringArrayField } from "#core/selectors/record.selector";
import { CANON_ARGV } from "#configuration/configs/invocation.config";
import type { CanonDefects } from "#types/canon.types";
import { absolutePath } from "@ssot/paths";
import { defineCheck } from "@govlab/context/check";
import { jsonRecord } from "#core/parsers/record.parser";
import path from "node:path";
import process from "node:process";
import { slugify } from "@govlab/context";

defineCheck({ detects: [], enforces: ["architecture:canonical-model"] });

const GENERATED_MARK = ".generated.";
const JSON_SUFFIX = ".json";
const EDGE_FIELDS = ["requires", "reinforces", "enables", "conflicts_with", "tensions_with"];

const recordsIn = function recordsIn(file: string, key: string): Record<string, unknown>[] {
    const text = readFileSync(file, "utf8");
    return recordsAt(jsonRecord(text), key);
};

const loadRecords = function loadRecords(dir: string): Record<string, unknown>[] {
    return readdirSync(dir)
        .filter((file) => file.endsWith(JSON_SUFFIX) && !file.includes(GENERATED_MARK))
        .flatMap((file) => recordsIn(path.join(dir, file), "records"));
};

const conceptIds = new Set(
    recordsIn(absolutePath("govlab.quality.generated.concepts"), "concepts").flatMap((concept) =>
        typeof concept["id"] === "string" ? [concept["id"]] : [],
    ),
);
const archRecords = loadRecords(absolutePath("govlab.context.principles"));
const algoRecords = loadRecords(absolutePath("govlab.context.algorithms"));
const registered = new Set([
    ...conceptIds,
    ...archRecords.flatMap((record) => (typeof record["name"] === "string" ? [canonicalizeId(record["name"])] : [])),
]);

const edgeRenames = function edgeRenames(record: Record<string, unknown>): string[] {
    return EDGE_FIELDS.flatMap((field) =>
        stringArrayField(record, field).flatMap((value) => {
            const canonical = canonicalizeId(value);
            return canonical !== value && registered.has(canonical)
                ? [`${String(record["name"])}.${field}: "${value}" → ${canonical}`]
                : [];
        }),
    );
};

const defects: CanonDefects = {
    algoForce: [],
    algoId: [],
    archEdge: [],
    archId: [],
    archRename: [],
    archType: [],
    unknownType: new Set(),
};

for (const record of archRecords) {
    const { id, name, type } = record;
    if (typeof type !== "string" || !isCanonicalKind(type)) {
        defects.archType.push(String(name));
        if (typeof type === "string" && canonicalizeKind(type) === null) {
            defects.unknownType.add(type);
        }
    }
    const canonId = typeof name === "string" ? canonicalizeId(name) : null;
    if (typeof id !== "string" || !isCanonicalId(id) || id !== canonId) {
        defects.archId.push(String(name));
    }
    if (typeof name === "string" && canonId !== slugify(name)) {
        defects.archRename.push(`${name}  →  ${canonId ?? ""}`);
    }
    defects.archEdge.push(...edgeRenames(record));
}

for (const record of algoRecords) {
    const { id } = record;
    if (typeof id === "string" && id !== slugify(id)) {
        defects.algoId.push(id);
    }
    defects.algoForce.push(...stringArrayField(record, "force").filter((force) => force !== slugify(force)));
}

const total = defects.archType.length + defects.archId.length + defects.algoId.length;
process.stdout.write(canonReport({ algoRecords: algoRecords.length, archRecords: archRecords.length, defects, total }));

const strict = hasFlag(resolveArgv(CANON_ARGV), FLAGS.strict);
if (strict && total > 0) {
    process.stderr.write(canonFailed(total));
    process.exit(FAILURE_EXIT);
}
process.stdout.write(strict ? CANON_CLEAN : CANON_REPORT_ONLY);
