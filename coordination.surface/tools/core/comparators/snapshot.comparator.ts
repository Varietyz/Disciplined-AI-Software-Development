import { ANCHOR_KINDS, markedElsewhere, measured, sameKinds } from "../analyzers/snapshot.analyzer.ts";
import type { Comparison, Extent, Judgment, Measured, Retained, Verdict } from "../types/snapshot.types.ts";
import { frozenFinding, shortenedFinding } from "../factories/snapshot.factory.ts";
import type { Finding } from "../types/segment.types.ts";
import type { StepOptions } from "../types/rule.types.ts";
import { retainedFrom } from "../readers/snapshot.reader.ts";

const judgment = function judgment(path: string, verdict: Verdict, finding: Finding | null = null): Judgment {
    return { finding, memberless: false, path, renamed: null, verdict };
};

const judgeAbsent = function judgeAbsent(path: string, prior: Extent, retained: Retained, extents: Measured): Judgment {
    if (prior.anchors.length === 0) {
        const carried = markedElsewhere(prior.mark, retained.surfaces, extents.current);
        return carried === null
            ? { ...judgment(path, "not-comparable"), memberless: true }
            : { ...judgment(path, "relocated"), renamed: `${path} → ${carried}` };
    }

    const stranded = prior.anchors.filter((anchor) => !extents.frozenAnchors.has(anchor));
    return stranded.length === 0
        ? judgment(path, "relocated")
        : judgment(path, "shortened", shortenedFinding(path, stranded, prior.lifetime));
};

const judgePresent = function judgePresent(path: string, prior: Extent, now: Extent, frozen: boolean): Judgment {
    if (now.lifetime !== prior.lifetime) {
        return judgment(path, "not-comparable");
    }

    const held = new Set(now.anchors);
    const missing = prior.anchors.filter((anchor) => !held.has(anchor));
    if (frozen) {
        const priorHeld = new Set(prior.anchors);
        const difference = [...missing, ...now.anchors.filter((anchor) => !priorHeld.has(anchor))];
        return difference.length === 0
            ? judgment(path, "unchanged")
            : judgment(path, "shortened", frozenFinding(path, difference, prior.lifetime));
    }

    return missing.length === 0
        ? judgment(path, "unchanged")
        : judgment(path, "shortened", shortenedFinding(path, missing, prior.lifetime));
};

const compared = function compared(retained: Retained, extents: Measured): Judgment[] {
    return Object.entries(retained.surfaces).map(([path, prior]) => {
        const now = extents.current.get(path);
        return now === undefined
            ? judgeAbsent(path, prior, retained, extents)
            : judgePresent(path, prior, now, extents.frozen.has(path));
    });
};

const verdictsOf = function verdictsOf(
    judged: readonly Judgment[],
    current: ReadonlyMap<string, Extent>,
    unseen: Verdict,
): Record<string, Verdict> {
    const verdicts: Record<string, Verdict> = Object.fromEntries(judged.map((entry) => [entry.path, entry.verdict]));
    for (const path of current.keys()) {
        verdicts[path] ??= unseen;
    }
    return verdicts;
};

const baselineOf = function baselineOf(
    current: ReadonlyMap<string, Extent>,
    retained: Retained | null,
    verdicts: Readonly<Record<string, Verdict>>,
): Record<string, Extent> {
    const surfaces: Record<string, Extent> = Object.fromEntries(current);
    for (const [path, prior] of Object.entries(retained?.surfaces ?? {})) {
        if (verdicts[path] === "shortened") {
            surfaces[path] = prior;
        }
    }
    return surfaces;
};

export const comparison = function comparison(options: StepOptions, paths: readonly string[]): Comparison {
    const extents = measured(options.repoRoot, paths);
    const { current } = extents;
    const retained = retainedFrom(options.repoRoot);
    const comparable = retained !== null && retained.range === options.scope && sameKinds(retained.anchorKinds);
    const judged = comparable ? compared(retained, extents) : [];

    const unseen: Verdict = comparable || retained === null ? "first-seen" : "not-comparable";
    const verdicts = verdictsOf(judged, current, unseen);
    const surfaces = baselineOf(current, retained, verdicts);
    const fresh = options.authoritative || retained === null;
    return {
        carried: fresh ? { anchorKinds: ANCHOR_KINDS, range: options.scope, surfaces } : retained,
        current,
        findings: judged.flatMap((entry) => (entry.finding === null ? [] : [entry.finding])),
        memberless: judged.filter((entry) => entry.memberless).map((entry) => entry.path),
        renamed: judged.flatMap((entry) => (entry.renamed === null ? [] : [entry.renamed])),
        retained,
        surfaces,
        verdicts,
    };
};
