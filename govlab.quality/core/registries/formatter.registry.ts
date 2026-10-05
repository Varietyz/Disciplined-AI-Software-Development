import type { ConfigFormatter, EmitFormat } from "#types/emitter.types";
import { duplicateFormatter } from "#configuration/strings/emitter.strings";

const FORMATTERS = new Map<EmitFormat, ConfigFormatter>();

export const defineFormatter = function defineFormatter(formatter: ConfigFormatter): ConfigFormatter {
    if (FORMATTERS.has(formatter.format)) {
        throw new Error(duplicateFormatter(formatter.format));
    }
    FORMATTERS.set(formatter.format, formatter);
    return formatter;
};

export const formatterFor = function formatterFor(format: EmitFormat): ConfigFormatter | undefined {
    return FORMATTERS.get(format);
};
