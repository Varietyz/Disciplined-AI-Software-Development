import {
    COMPRESS_NEEDS_AGENT,
    compressionNoRecord,
    fieldEmptied,
    fieldsCompressed,
    itemDropped,
    itemFenceMalformed,
    noMarkedField,
    nothingToCompress,
    surfaceContended,
} from "../strings/board.strings.ts";
import { blockOf, compressBoard } from "../transformers/board.transformer.ts";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { landWitnessed, refuse } from "../writers/board.writer.ts";
import type { CompressOutcome } from "../types/board.types.ts";
import { dropItemSpan } from "../resolvers/board.resolver.ts";
import { extractionRefusal } from "../validators/archive.validator.ts";
import { fieldKeyAt } from "../analyzers/board.analyzer.ts";
import { isItemId } from "../formatters/board.formatter.ts";

interface CompressRequest {
    readonly target: string;
    readonly absolute: string;
    readonly marker: string;
    readonly agent: string | null;
    readonly extracted: string | null;
    readonly archive: string;
    readonly changelog: string;
    readonly heal: boolean;
}

const dropItem = function dropItem(request: CompressRequest, before: string): CompressOutcome {
    const dropped = dropItemSpan(before, request.marker);
    if (dropped === null) {
        return refuse(itemFenceMalformed(request.marker), 2);
    }

    if (request.heal) {
        if (readFileSync(request.absolute, "utf8") !== before) {
            return refuse(surfaceContended(request.target), 1);
        }
        writeFileSync(request.absolute, dropped.text, "utf8");
    }

    return {
        code: 0,
        excised: [request.marker],
        message: itemDropped(request.marker, dropped.removed, request.heal),
        write: request.heal ? dropped.text : null,
    };
};

const compressFields = function compressFields(
    request: CompressRequest,
    agent: string,
    before: string,
    retry: () => CompressOutcome,
): CompressOutcome {
    const span = blockOf(before, agent);
    if (span === null) {
        return refuse(compressionNoRecord(agent), 2);
    }

    const lines = before.split("\n");
    const body = lines.slice(span.from, span.to - 1);
    const schemaField = body.some((line) => fieldKeyAt(line) === request.marker);
    const compressed = compressBoard(body.join("\n"), request.marker, schemaField);
    if (compressed.fields === 0) {
        return refuse(noMarkedField(request.target), 0);
    }

    const text = [...lines.slice(0, span.from), compressed.text, ...lines.slice(span.to - 1)].join("\n");
    const outcome = {
        code: 0,
        excised: compressed.excised,
        message: schemaField
            ? fieldEmptied(request.marker, request.target, compressed.removed, request.heal)
            : fieldsCompressed(request.target, compressed.fields, compressed.removed, request.heal),
        write: request.heal ? text : null,
    };

    return request.heal
        ? landWitnessed(
              { absolute: request.absolute, agent, before, target: request.target, written: text },
              outcome,
              retry,
          )
        : outcome;
};

export const runCompression = function runCompression(request: CompressRequest): CompressOutcome {
    if (!existsSync(request.absolute)) {
        return refuse(nothingToCompress(request.target), 2);
    }

    const { agent } = request;
    if (agent === null) {
        return refuse(COMPRESS_NEEDS_AGENT, 2);
    }

    const carried = existsSync(request.archive) ? readFileSync(request.archive, "utf8") : "";
    const refusal = extractionRefusal(request.changelog, request.extracted, carried);
    if (refusal !== null) {
        return refuse(refusal, 2);
    }

    const before = readFileSync(request.absolute, "utf8");
    return isItemId(request.marker)
        ? dropItem(request, before)
        : compressFields(request, agent, before, () => runCompression({ ...request }));
};
