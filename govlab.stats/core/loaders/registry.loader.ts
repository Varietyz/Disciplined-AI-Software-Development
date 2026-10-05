import { arrayField, field, stringField } from "#core/selectors/field.selector";
import { DISPOSITION } from "#configuration/constants/rule.constants";
import type { RegistryCounts } from "#types/rule.types";
import path from "node:path";
import { readJson } from "#core/loaders/data.loader";
import { relativePath } from "@ssot/paths";

export const readRegistry = function readRegistry(root: string): RegistryCounts {
    const registry = readJson(path.join(root, relativePath("govlab.quality.data.registry")));
    const records = arrayField(registry, "records");
    const nonPlugin = records.filter((record) => field(record, "isPlugin") !== true);
    const withDisposition = function withDisposition(name: string): unknown[] {
        return nonPlugin.filter((record) => stringField(record, "disposition") === name);
    };
    return {
        advisory: withDisposition(DISPOSITION.advisory).length,
        excluded: withDisposition(DISPOSITION.excluded).length,
        fullGate: withDisposition(DISPOSITION.fullGate).map((record) => ({
            ecosystem: stringField(record, "ecosystem"),
            tool: stringField(record, "tool"),
        })),
        plugins: records.length - nonPlugin.length,
        selectable: withDisposition(DISPOSITION.selectable).length,
    };
};
