import { recordAt, stringArrayField } from "#core/selectors/record.selector";
import { absolutePath } from "@ssot/paths";
import { jsonRecord } from "#core/parsers/record.parser";
import { readFileSync } from "node:fs";

const KIND_FILE = "kind.data.json";

export const loadKindMap = function loadKindMap(): ReadonlyMap<string, string> {
    const text = readFileSync(absolutePath("govlab.quality.data", KIND_FILE), "utf8");
    const kinds = recordAt(jsonRecord(text), "kinds");
    return new Map(
        Object.keys(kinds).flatMap((kind) =>
            stringArrayField(kinds, kind).map((label): [string, string] => [label, kind]),
        ),
    );
};
