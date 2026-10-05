import type { Atom, CallEntry, ExportEntry, FileFlags, GraphDelta, GraphEntries } from "#types/closure.types";
import { EMIT_EVENT, EVENT_FUNCTIONS, SUBSCRIBE_EVENT } from "#configuration/constants/closure.constants";
import { isConsumerCall, isRegisterCall } from "#core/predicates/closure.predicate";

export const foldDeltas = function foldDeltas(deltas: readonly GraphDelta[]): GraphEntries {
    return {
        consumers: deltas.flatMap((delta) => delta.consumers ?? []),
        emits: deltas.flatMap((delta) => delta.emits ?? []),
        eventActivity: deltas.flatMap((delta) => delta.eventActivity ?? []),
        exports: deltas.flatMap((delta) => delta.exports ?? []),
        externalConsumers: deltas.flatMap((delta) => delta.externalConsumers ?? []),
        iconsExports: deltas.flatMap((delta) => delta.iconsExports ?? []),
        idsExports: deltas.flatMap((delta) => delta.idsExports ?? []),
        imports: deltas.flatMap((delta) => delta.imports ?? []),
        interfaces: deltas.flatMap((delta) => delta.interfaces ?? []),
        registers: deltas.flatMap((delta) => delta.registers ?? []),
        sideEffectImports: deltas.flatMap((delta) => delta.sideEffectImports ?? []),
        stringsExports: deltas.flatMap((delta) => delta.stringsExports ?? []),
        subscribes: deltas.flatMap((delta) => delta.subscribes ?? []),
    };
};

export const callDelta = function callDelta(entry: CallEntry, idArg: Atom | null): GraphDelta {
    const { file, fn } = entry;
    return {
        consumers: isConsumerCall(fn) ? [entry] : [],
        emits: fn === EMIT_EVENT ? [{ eventArg: idArg, file }] : [],
        eventActivity: EVENT_FUNCTIONS.has(fn) ? [entry] : [],
        registers: isRegisterCall(fn) ? [entry] : [],
        subscribes: fn === SUBSCRIBE_EVENT ? [{ eventArg: idArg, file }] : [],
    };
};

export const exportDelta = function exportDelta(names: readonly string[], file: string, flags: FileFlags): GraphDelta {
    const entries: ExportEntry[] = names.map((name) => ({ file, name }));
    return {
        exports: entries,
        iconsExports: flags.isIcons ? entries : [],
        idsExports: flags.isIds ? entries : [],
        stringsExports: flags.isStrings ? entries : [],
    };
};
