import type { Bucket, State } from "#types/source.types";
import { MEDIAN, NINETIETH, TOP_LARGEST } from "#configuration/constants/metric.constants";
import type { Derived } from "#types/report.types";
import { percentile } from "#core/selectors/metric.selector";

const EMPTY_BUCKET: Bucket = { blank: 0, bytes: 0, code: 0, files: 0, total: 0 };

export const bucketOf = function bucketOf<K>(buckets: ReadonlyMap<K, Bucket>, key: K): Bucket {
    return buckets.get(key) ?? EMPTY_BUCKET;
};

export const deriveMetrics = function deriveMetrics(state: State): Derived {
    const sortedLines = state.fileLineCounts.toSorted((a, b) => a - b);
    const source = bucketOf(state.authored, "source");
    const authoredFiles = [...state.authored.values()].reduce((sum, bucket) => sum + bucket.files, 0);
    return {
        areaRows: [...state.byArea.entries()].toSorted((a, b) => b[1].code - a[1].code),
        authoredFiles,
        authoredLines: state.lines.code,
        avgLines: authoredFiles > 0 ? Math.round(state.lines.total / authoredFiles) : 0,
        emptyFiles: state.fileLineCounts.filter((count) => count === 0).length,
        extRows: [...state.byExt.entries()].toSorted((a, b) => b[1].code - a[1].code),
        largestLines: sortedLines.at(-1) ?? 0,
        medianLines: percentile(sortedLines, MEDIAN),
        p90Lines: percentile(sortedLines, NINETIETH),
        sourceBlank: source.blank,
        sourceLines: source.code,
        topLargest: state.largest.toSorted((a, b) => b.lines - a.lines).slice(0, TOP_LARGEST),
    };
};
