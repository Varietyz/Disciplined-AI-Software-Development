import { CARRIED_FIELDS, FIELD_SCOPES, HIDDEN_FIELDS } from "../../shared/manifests/field.manifest.ts";
import {
    UNDECLARED_HIDDEN,
    emptyScope,
    fieldReachLine,
    missingRoot,
    unreadCarrier,
    unreadField,
} from "../strings/validation.strings.ts";
import type { ScopeReach } from "../../types/field.types.ts";
import { defineCheck } from "@govlab/context/check";
import process from "node:process";
import { scopeReach } from "../analyzers/field.analyzer.ts";

defineCheck({ detects: ["architecture:zombie-code"], enforces: [] });

const FAILURE = 1;

const isCarried = function isCarried(reach: ScopeReach, key: string): boolean {
    const carrier = CARRIED_FIELDS.get(key);
    return carrier !== undefined && reach.read.has(carrier);
};

const unreadOf = function unreadOf(reach: ScopeReach): ScopeReach["fields"] {
    return reach.fields.filter(
        (field) => !reach.read.has(field.key) && !isCarried(reach, field.key) && !HIDDEN_FIELDS.has(field.key),
    );
};

const reaches = FIELD_SCOPES.map(scopeReach);
let failed = false;
for (const reach of reaches) {
    const unread = unreadOf(reach);
    const hidden = reach.fields.filter((field) => HIDDEN_FIELDS.has(field.key)).length;
    const carried = reach.fields.filter((field) => !reach.read.has(field.key) && isCarried(reach, field.key)).length;
    const read = reach.fields.length - unread.length - hidden - carried;
    process.stdout.write(
        fieldReachLine(reach.label, { carried, fields: reach.fields.length, hidden, read, unread: unread.length }),
    );
    if (reach.fields.length === 0) {
        process.stderr.write(emptyScope(reach.label));
        failed = true;
    }
    for (const root of reach.missingRoots) {
        process.stderr.write(missingRoot(root.file, reach.label, root.name));
        failed = true;
    }
    for (const field of unread) {
        const carrier = CARRIED_FIELDS.get(field.key);
        const reason = carrier === undefined ? UNDECLARED_HIDDEN : unreadCarrier(carrier);
        process.stderr.write(unreadField(`${field.file}:${String(field.line)}`, field.key, reach.label, reason));
        failed = true;
    }
}
if (failed) {
    process.exit(FAILURE);
}
