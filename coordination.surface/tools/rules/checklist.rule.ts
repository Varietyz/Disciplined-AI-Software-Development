import type { RuleContext, RuleDeclaration, RuleResult } from "../core/types/rule.types.ts";
import {
    activeSet,
    contractOf,
    countBreaches,
    inspectSurface,
    rowMarkersOf,
} from "../core/coordinators/checklist.coordinator.ts";
import { activeVenues, authoredSurfaces, planningSurfaces } from "../core/filters/checklist.filter.ts";
import { declaresContract, taskBlocks } from "../core/validators/checklist.validator.ts";
import { DECIDE } from "../core/constants/checklist.constants.ts";
import type { Finding } from "../core/types/segment.types.ts";
import { declaredDistributions } from "../core/resolvers/converge.resolver.ts";
import { itemSpanFlags } from "../core/analyzers/fence.analyzer.ts";
import { regionAdmitsRewrite } from "../../config/surface.config.ts";

const basenameOf = function basenameOf(path: string): string {
    const slash = path.lastIndexOf("/");
    return slash === -1 ? path : path.slice(slash + 1);
};

const checklistFinding = function checklistFinding(
    kind: string,
    path: string,
    line: number,
    locus: string,
    actual: string,
    expected: string,
): Finding {
    return {
        actual,
        expected,
        healed: false,
        line,
        locus,
        path,
        remediation: {
            action: "declare",
            decide: DECIDE[kind] ?? kind,
            deterministic: false,
            from: locus,
            target: path,
            to: null,
        },
        rule: `checklist/${kind}`,
        stack: [
            { check: "checklist", resolved: basenameOf(path) },
            { check: kind, resolved: locus },
        ],
    };
};

type Breach = ReturnType<typeof countBreaches>[number];

const breachFinding = function breachFinding(path: string, breach: Breach): Finding {
    return checklistFinding(breach.kind, path, breach.line, breach.locus, breach.actual, breach.expected);
};

const SEALED_REASON =
    " sits inside an item span, and this surface declares that region APPEND-ONLY — " +
    "the remediation for this kind is a REWRITE, so a finding here offers the one operation the " +
    "region forbids, to every party, on every run, forever. A report nobody can drain trains every " +
    "reader to discount the color and the cost lands on the findings beside it, so the standing is " +
    "WITHDRAWN and the observation is published rather than raised";

interface CountScan {
    readonly findings: Finding[];
    readonly withdrawn: [string, string][];
}

const countScan = function countScan(path: string, source: string): CountScan {
    const sealed = regionAdmitsRewrite(path, "item") ? [] : itemSpanFlags(source);
    const breaches = countBreaches(source.split("\n"));
    const isSealed = (breach: Breach): boolean => sealed[breach.line - 1] === true;

    return {
        findings: breaches.filter((breach) => !isSealed(breach)).map((breach) => breachFinding(path, breach)),
        withdrawn: breaches
            .filter(isSealed)
            .map((breach) => [`${path}:${String(breach.line)}`, `${breach.locus}${SEALED_REASON}`]),
    };
};

const undeclaredFinding = function undeclaredFinding(path: string): Finding {
    return checklistFinding(
        "undeclaredDistribution",
        path,
        1,
        basenameOf(path),
        "this planning surface carries task rows and declares no distribution, so it is held to neither the phase contract nor the spent check — both key on that one declaration",
        "the venue this surface distributes, declared in its own header, or the surface retired",
    );
};

type Distribution = ReturnType<typeof declaredDistributions>[number];

const spentFinding = function spentFinding({ declares, line, path }: Distribution): Finding {
    return checklistFinding(
        "spentDistribution",
        path,
        line,
        declares,
        `this planning surface declares ${declares} and the active tree holds no venue by that name, so its distribution is SPENT`,
        "the surface retired where its dependencies allow, or its own header recording that it is spent and why",
    );
};

export const rule: RuleDeclaration = {
    check(context: RuleContext): RuleResult {
        const read = (target: string): string => context.read(target);
        const contract = contractOf(context.repoRoot);
        const active = activeSet(context.repoRoot);
        const fields = rowMarkersOf(context.repoRoot);

        const authored = authoredSurfaces(context.paths);
        const planning = planningSurfaces(context.paths);
        const counts = authored.map((path) => countScan(path, read(path)));
        const reports = planning.map((path) => ({
            path,
            report: inspectSurface(path, read(path).split("\n"), contract, active, fields),
        }));

        const live = activeVenues(context.paths);
        const declaredSet = declaredDistributions(planning, read);
        const declaring = new Set(declaredSet.map((entry) => entry.path));
        const undeclared = planning.filter(
            (path) => !declaring.has(path) && declaresContract(taskBlocks(read(path).split("\n")), fields),
        );
        const spentSet = declaredSet.filter(({ declares }) => !live.some((venue) => venue.endsWith(declares)));

        const findings = [
            ...counts.flatMap((scan) => scan.findings),
            ...reports.flatMap(({ path, report }) => report.breaches.map((breach) => breachFinding(path, breach))),
            ...undeclared.map(undeclaredFinding),
            ...spentSet.map(spentFinding),
        ];

        const derivations: Record<string, unknown> = {
            activeAgents: [...active],
            contract,
            contractReached: planning,
            countReached: authored,
            rowMarkers: fields,
            withdrawnInSealedRegion: Object.fromEntries(counts.flatMap((scan) => scan.withdrawn)),
            ...Object.fromEntries(reports.map(({ path, report }) => [path, report.derivations])),
            activeVenues: live,
            declaredDistributions: declaredSet.map(({ declares, path }) => `${path} · ${declares}`),
            spentDistributionOperands:
                "both operands are DECLARED and neither is a reading of the surface's contents: the header naming a venue, " +
                "and the set of venue files in the active tree. A spent distribution is a STATE rather than an error — the " +
                "work it distributed is either built or blocked — so the finding names the two dispositions and decides " +
                "between them for nobody. What it answers is the question a reader opening the planning directory cannot: " +
                "which surface distributes a venue that is still being argued. A surface whose own retirement condition is " +
                "decidable and whose state nothing derives can only be closed by somebody remembering to look.",
            spentDistributions: spentSet.map(({ declares, path }) => `${path} · ${declares}`),
            undeclaredDistributions: undeclared,
        };

        return { derivations, findings, healed: [] };
    },
    extensions: [".md"],
    heals: false,
    invariant:
        "a planning surface carries tasks and their contracts, current and future only, and one carrying the " +
        "checklist concern answers to the template's rendered contract — axes and ripple read at the phase level " +
        "because that is where the render emits them, whatever level the model attaches them to; and the " +
        "transcribed-count half binds EVERY authored surface rather than the planning ones alone, because a " +
        "surface stating how many of a derived set exists has copied a fact the pipeline computes wherever it " +
        "sits, with the frozen and upstream surfaces outside the population by derivation from their declared " +
        "lifetime rather than by a list, since a finding on a surface nothing may rewrite is a repair nobody can " +
        "reach",
    jurisdiction: "all",
    kinds: [
        "notAChecklist",
        "gateUnnamed",
        "axesMissing",
        "rippleMissing",
        "genesisMissing",
        "precheckedGate",
        "contractIncomplete",
        "history",
        "literalCount",
        "phaseWithoutTask",
        "danglingBinding",
        "danglingReference",
        "duplicateId",
        "closureBeforeItsDependencies",
        "spentDistribution",
        "undeclaredDistribution",
    ],
    stage: "content",

    wholeScopeOnly: true,
};
