import { arrayField, stringField } from "#core/selectors/field.selector";
import type { QualityStats } from "#types/catalog.types";
import path from "node:path";
import { readJson } from "#core/loaders/data.loader";
import { relativePath } from "@ssot/paths";

const tallyBy = function tallyBy(rules: readonly unknown[], key: string): Map<string, number> {
    const counts = new Map<string, number>();
    for (const bucket of rules.map((rule) => stringField(rule, key)).filter((value) => value.length > 0)) {
        counts.set(bucket, (counts.get(bucket) ?? 0) + 1);
    }
    return counts;
};

const emptyQuality = function emptyQuality(): QualityStats {
    return {
        available: false,
        byEcosystem: new Map(),
        byTool: new Map(),
        canonicalMapped: 0,
        concepts: 0,
        ecosystems: 0,
        producer: relativePath("govlab.quality"),
        tools: 0,
        totalRules: 0,
    };
};

export const collectQuality = function collectQuality(root: string): QualityStats {
    const rawRules = readJson(path.join(root, relativePath("govlab.quality.generated.rules")));
    const rules: unknown[] = Array.isArray(rawRules) ? rawRules : [];
    if (rules.length === 0) {
        return emptyQuality();
    }
    const byEcosystem = tallyBy(rules, "ecosystem");
    const byTool = tallyBy(rules, "tool");
    const conceptIndex = readJson(path.join(root, relativePath("govlab.quality.generated.concepts")));
    return {
        available: true,
        byEcosystem,
        byTool,
        canonicalMapped: rules.filter((rule) => arrayField(rule, "canonical").length > 0).length,
        concepts: arrayField(conceptIndex, "concepts").length,
        ecosystems: byEcosystem.size,
        producer: relativePath("govlab.quality"),
        tools: byTool.size,
        totalRules: rules.length,
    };
};
