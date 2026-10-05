import {
    COVERAGE_COMPLETE,
    COVERAGE_GAPS,
    coverageGaps,
    coverageHeading,
    missingAiContext,
    missingCapabilities,
    rankedRow,
    withoutRelationships,
} from "#configuration/strings/coverage.strings";
import { arrayField, recordField } from "#core/selectors/record.selector";
import type { CoverageRow } from "#types/index.types";
import type { ManifestModule } from "#types/manifest.types";
import { RELATIONSHIP_KEYS } from "#configuration/constants/manifest.constants";

const GAP_JOIN = ", ";

const gapsOf = function gapsOf(module: ManifestModule, isPrivate: boolean): string[] {
    const { manifest } = module;
    const relationships = RELATIONSHIP_KEYS.reduce((sum, key) => sum + arrayField(manifest, key).length, 0);
    const hasAiContext = Boolean(recordField(manifest, "docs")?.["aiContext"]);
    return [
        ...(arrayField(manifest, "capabilities").length === 0 ? [COVERAGE_GAPS.capabilities] : []),
        ...(!isPrivate && !hasAiContext ? [COVERAGE_GAPS.aiContext] : []),
        ...(relationships === 0 ? [COVERAGE_GAPS.relationships] : []),
    ];
};

export const coverageRow = function coverageRow(module: ManifestModule): CoverageRow {
    const isPrivate = recordField(module.manifest, "visibility")?.["private"] === true;
    return { gaps: gapsOf(module, isPrivate), isPrivate, slug: module.label };
};

const withGap = function withGap(rows: readonly CoverageRow[], gap: string): number {
    return rows.filter((row) => row.gaps.includes(gap)).length;
};

const byGapsThenSlug = function byGapsThenSlug(left: CoverageRow, right: CoverageRow): number {
    return right.gaps.length - left.gaps.length || left.slug.localeCompare(right.slug);
};

export const blockingGaps = function blockingGaps(rows: readonly CoverageRow[]): number {
    return withGap(rows, COVERAGE_GAPS.capabilities) + withGap(rows, COVERAGE_GAPS.aiContext);
};

export const renderCoverage = function renderCoverage(rows: readonly CoverageRow[]): string[] {
    const blocking = blockingGaps(rows);
    const ranked = rows.filter((row) => row.gaps.length > 0).toSorted(byGapsThenSlug);
    return [
        coverageHeading(rows.length),
        missingCapabilities(withGap(rows, COVERAGE_GAPS.capabilities)),
        missingAiContext(withGap(rows, COVERAGE_GAPS.aiContext)),
        withoutRelationships(withGap(rows, COVERAGE_GAPS.relationships)),
        ...ranked.map((row) => rankedRow(row.slug, row.isPrivate, row.gaps.join(GAP_JOIN))),
        blocking === 0 ? COVERAGE_COMPLETE : coverageGaps(blocking),
    ];
};
