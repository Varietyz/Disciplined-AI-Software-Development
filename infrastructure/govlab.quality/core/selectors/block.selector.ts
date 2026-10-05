import type { LineRange } from "#types/edit.types";
import type { OxlintBlockExclusion } from "#types/config.types";
import type { PlacedFinding } from "#types/finding.types";
import { forwardSlashed } from "#core/converters/filename.converter";
import { functionRangesIn } from "#core/visitors/block.visitor";

export const filterBlockExcluded = function filterBlockExcluded<T extends PlacedFinding>(
    findings: T[],
    exclusions: readonly OxlintBlockExclusion[],
    root: string,
): T[] {
    if (exclusions.length === 0) {
        return findings;
    }
    const cache = new Map<string, LineRange[]>();
    const rangesOf = (exclusion: OxlintBlockExclusion): LineRange[] => {
        const key = `${exclusion.file}|${exclusion.functions.join(",")}`;
        const resolved = cache.get(key) ?? functionRangesIn(root, exclusion.file, new Set(exclusion.functions));
        cache.set(key, resolved);
        return resolved;
    };
    const excluded = (finding: PlacedFinding): boolean =>
        exclusions.some(
            (exclusion) =>
                finding.ruleId === exclusion.rule &&
                forwardSlashed(finding.file).endsWith(forwardSlashed(exclusion.file)) &&
                rangesOf(exclusion).some((range) => finding.line >= range.start && finding.line <= range.end),
        );
    return findings.filter((finding) => !excluded(finding));
};
