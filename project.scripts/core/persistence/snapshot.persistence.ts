import { EMPTY_FRAME, logWritten, shotWritten } from "#configuration/strings/snapshot.strings";
import type { ConsoleRecord } from "@banes-lab/build-scripts/types/browser.types.ts";
import type { SnapshotOptions } from "#types/snapshot.types";
import { dirname } from "node:path";
import { logLines } from "#core/formatters/snapshot.formatter";
import { mkdirSync } from "node:fs";
import process from "node:process";
import { writeVerbatim } from "@govlab/canonical-write";

const PNG_BASE64 = "base64";

export const writeArtifacts = function writeArtifacts(
    options: SnapshotOptions,
    data: string,
    records: readonly ConsoleRecord[],
): boolean {
    if (options.log !== null) {
        mkdirSync(dirname(options.log), { recursive: true });
        writeVerbatim(options.log, logLines(records));
        process.stdout.write(logWritten(options.log, records.length));
    }
    if (options.out === null) {
        return true;
    }
    if (data.length === 0) {
        process.stderr.write(EMPTY_FRAME);
        return false;
    }
    writeVerbatim(options.out, Buffer.from(data, PNG_BASE64));
    process.stdout.write(shotWritten(options.out));
    return true;
};
