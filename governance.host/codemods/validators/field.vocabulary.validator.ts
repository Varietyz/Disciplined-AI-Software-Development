import { CLOSED_SCOPE_LABEL, FIELD_SCOPES, PLAIN_CLOSED_FIELDS } from "../../shared/manifests/field.manifest.ts";
import { closedValuesLine, noClosedScope, plainClosedValue } from "../strings/validation.strings.ts";
import { defineCheck } from "@govlab/context/check";
import { plainClosedValues } from "../analyzers/field.vocabulary.analyzer.ts";
import process from "node:process";

defineCheck({ detects: [], enforces: ["architecture:closed-vocabulary"] });

const FAILURE = 1;

const scope = FIELD_SCOPES.find((entry) => entry.label === CLOSED_SCOPE_LABEL);
if (scope === undefined) {
    process.stderr.write(noClosedScope(CLOSED_SCOPE_LABEL));
    process.exit(FAILURE);
}
const found = plainClosedValues(scope);
const plain = found.filter((entry) => !PLAIN_CLOSED_FIELDS.has(entry.target));
process.stdout.write(closedValuesLine(found.length, found.length - plain.length, plain.length));
for (const entry of plain) {
    process.stderr.write(plainClosedValue(`${entry.file}:${String(entry.line)}`, entry.vocabulary, entry.target));
}
if (plain.length > 0) {
    process.exit(FAILURE);
}
