import type { CaptureJob, ExportOptions, ExportResult } from "#types/stage.types";
import { SUBJECT_SEPARATOR, UNKNOWN_CARD } from "#configuration/strings/card.strings";
import {
    ledgerKeyOf,
    outdatedJobs,
    pruneOrphans,
    readLedger,
    shareEntriesOf,
    writeImages,
    writeLedger,
    writeShareMap,
} from "#core/persistence/image.persistence";
import type { CardSpec } from "#types/card.types";
import type { RenderedImage } from "#types/image.types";
import { absolutePath } from "@ssot/paths";
import { captureCards } from "#core/coordinators/card.coordinator";
import { profilesOf } from "#core/converters/filename.converter";
import { publishShares } from "#core/persistence/export.persistence";

const scopeOf = function scopeOf(specs: readonly CardSpec[], only: string | null): readonly CardSpec[] {
    if (only === null) {
        return specs;
    }
    const chosen = specs.filter((spec) => spec.id === only);
    if (chosen.length === 0) {
        throw new Error(UNKNOWN_CARD + SUBJECT_SEPARATOR + only);
    }
    return chosen;
};

const everyJob = function everyJob(specs: readonly CardSpec[]): readonly CaptureJob[] {
    return specs.flatMap((spec) => profilesOf(spec).map((profile) => ({ profile, spec })));
};

const keyOf = function keyOf(job: CaptureJob): string {
    return ledgerKeyOf(job.spec.id, job.profile.id);
};

export const exportCards = async function exportCards(
    options: ExportOptions,
    specs: readonly CardSpec[],
): Promise<ExportResult> {
    const renders = absolutePath("app.cardRenders");
    const location = absolutePath("app.shareLedger");
    const ledger = readLedger(location);
    const scoped = scopeOf(specs, options.only);
    const jobs = options.force ? everyJob(scoped) : outdatedJobs(scoped, ledger, renders);
    const persist = async (images: readonly RenderedImage[]): Promise<void> => {
        writeImages(images, renders);
        await writeLedger(location, readLedger(location), images, specs);
    };
    if (jobs.length > 0) {
        await captureCards({ gpu: options.gpu, onCaptured: persist, url: options.url }, jobs);
    }
    const pruned = pruneOrphans(specs, renders);
    await writeLedger(location, readLedger(location), [], specs);
    const entries = shareEntriesOf(specs, renders);
    publishShares(entries, renders, absolutePath("app.shares"));
    await writeShareMap(absolutePath("app.shareMap"), entries);
    const rendered = new Set(jobs.map(keyOf));
    return {
        current: everyJob(scoped)
            .map(keyOf)
            .filter((key) => !rendered.has(key)),
        pruned,
        rendered: [...rendered],
    };
};
