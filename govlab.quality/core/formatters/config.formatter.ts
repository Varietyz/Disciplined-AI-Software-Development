import type { ConfigValue } from "#types/emitter.types";
import { defineFormatter } from "#core/registries/formatter.registry";
import { treeFor } from "#core/converters/emitter.converter";

const JSON_INDENT = 4;

export const serializeJsRecord = function serializeJsRecord(tree: ConfigValue): string {
    return `${JSON.stringify(tree, null, JSON_INDENT)}\n`;
};

defineFormatter({ format: "js-record", render: (input) => serializeJsRecord(treeFor(input)) });
