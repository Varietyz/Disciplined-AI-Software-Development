import type { RuleContext, RuleDeclaration, RuleResult } from "../core/types/rule.types.ts";
import { contentIsUnrepairable, lifetimeOf, surfacePath } from "../../config/surface.config.ts";
import {
    deleteReport,
    orphanReports,
    selfAuditedReports,
    unaccountedScopeGaps,
    unevaluableScopes,
    withdrawnStandings,
} from "../core/validators/governance.validator.ts";
import { orphanFinding, staleChannelFinding, writerFinding } from "../core/factories/governance.factory.ts";
import { removeChannel, staleChannels } from "../core/validators/channel.validator.ts";
import { scopeGapFinding, unevaluableFinding, unrepairableFinding } from "../core/factories/report.factory.ts";
import { shapeFindings, sourceFindings } from "../core/validators/rule.validator.ts";
import type { Finding } from "../core/types/segment.types.ts";
import { RULE_ROOT } from "../core/constants/layer.constants.ts";
import { STAGES } from "../core/types/rule.types.ts";
import { claimedReportIds } from "../core/validators/emission.validator.ts";
import { contains } from "../core/predicates/text.predicate.ts";
import { existsSync } from "node:fs";
import { isItemId } from "../core/formatters/board.formatter.ts";
import { resolve } from "node:path";
import { unrepairableLoci } from "../core/validators/repair.validator.ts";
import { unsanctionedWriters } from "../core/validators/writer.validator.ts";

const CORE = surfacePath("core");

const RUN_ENTRIES = [`${surfacePath("entrypoints")}/pipeline.entrypoint.ts`];

const SANCTIONED_WRITERS = [
    `${CORE}/writers/repair.writer.ts`,
    `${CORE}/reporters/rule.reporter.ts`,
    `${CORE}/reporters/segment.reporter.ts`,
    `${CORE}/registries/claim.registry.ts`,
    `${CORE}/registries/snapshot.registry.ts`,
    `${CORE}/validators/channel.validator.ts`,
    `${CORE}/validators/governance.validator.ts`,
];

const RULE_SELECTOR = "rule=";

const STAGE_SELECTOR = "stage=";

interface Healing {
    readonly findings: Finding[];
    readonly healed: string[];
}

const permanentSpan = function permanentSpan(reported: string, locus: string): boolean {
    if (!isItemId(locus)) {
        return false;
    }
    return lifetimeOf(reported)?.retention === "accumulating";
};

const channelScopeResolver = function channelScopeResolver(
    repoRoot: string,
    claimed: ReadonlySet<string>,
): (scope: string) => boolean {
    return (scope: string): boolean => {
        if (scope.startsWith(RULE_SELECTOR)) {
            return claimed.has(scope.slice(RULE_SELECTOR.length));
        }
        if (scope.startsWith(STAGE_SELECTOR)) {
            return STAGES.some((stage) => stage === scope.slice(STAGE_SELECTOR.length));
        }

        return existsSync(resolve(repoRoot, scope));
    };
};

const healOrphans = function healOrphans(repoRoot: string, claimed: ReadonlySet<string>): Healing {
    const orphans = orphanReports(repoRoot, claimed);
    for (const name of orphans) {
        deleteReport(repoRoot, name);
    }
    return { findings: orphans.map(orphanFinding), healed: [...orphans] };
};

const writerFindings = function writerFindings(context: RuleContext): Finding[] {
    const known = new Set(context.paths.filter((path) => path.endsWith(".ts")));
    return unsanctionedWriters(RUN_ENTRIES, known, context.read, SANCTIONED_WRITERS).map(writerFinding);
};

const healChannels = function healChannels(repoRoot: string, claimed: ReadonlySet<string>): Healing {
    const stale = staleChannels(repoRoot, channelScopeResolver(repoRoot, claimed));
    for (const channel of stale) {
        removeChannel(repoRoot, channel.name);
    }
    return { findings: stale.map(staleChannelFinding), healed: stale.map((channel) => channel.name) };
};

export const rule: RuleDeclaration = {
    check(context: RuleContext): RuleResult {
        const { repoRoot } = context;
        const claimed = claimedReportIds(repoRoot);
        const orphans = healOrphans(repoRoot, claimed);
        const writers = writerFindings(context);
        const channels = healChannels(repoRoot, claimed);
        const sources = context.paths.filter((path) => contains(path, RULE_ROOT));

        const findings = [
            ...orphans.findings,
            ...writers,
            ...channels.findings,
            ...unaccountedScopeGaps(repoRoot).map(scopeGapFinding),
            ...unevaluableScopes(repoRoot).map(unevaluableFinding),
            ...unrepairableLoci(repoRoot, contentIsUnrepairable, permanentSpan).map(unrepairableFinding),
            ...sources.flatMap((path) => sourceFindings(repoRoot, path, context.read(path))),
            ...shapeFindings(context),
        ];

        return {
            derivations: {
                identityContract:
                    "a check's identity is DERIVED from its filename subject and is declared nowhere, so the two-name divergence this walk once compared is unconstructible rather than absent. The comparison is not reported as passing, because a check whose members cannot exist is dead rather than green — what replaces it is the registry refusing any declaration that carries an id at all, which is the collapse the join was a substitute for",
                reportsAudited: [...claimed].toSorted((left, right) => left.localeCompare(right, "en")),
                ruleSourcesWalked: sources,
                selfAuditStanding:
                    "this check reads reports its own run writes, so the verdict on any report listed under selfAudited describes the PREVIOUS run of it — a first verdict after repairing this check is one run behind, and the second run is the one authoritative for that member. The lag is stated rather than excluded, because excluding a check from its own audit installs a blind spot shaped exactly like the thing being hidden",
                selfAudited: selfAuditedReports(repoRoot, context.id),
                skippedAsNotARuleSource: context.paths.filter((path) => !contains(path, RULE_ROOT)),
                standingContract:
                    "a verdict carries a STANDING beside its value, and a report listed under withdrawnStandings read a surface that has CHANGED since the report was written — so that verdict describes a tree that has moved and is not authoritative to quote, while the verdict itself is untouched because declaring it a failure would assert a defect nothing observed. This is published as a DERIVATION rather than emitted as a finding, deliberately: on a surface several parties write continuously every report is stale within moments of any write, so a finding here would be red between every run and a permanent red teaches every reader to discount the color — the cost landing on the findings beside it rather than on itself. The reader who needs this is the one about to QUOTE a verdict, and the honest mechanism hands them the standing rather than failing a build over a transient",
                withdrawnStandings: withdrawnStandings(repoRoot),
            },
            findings,
            healed: [...orphans.healed, ...channels.healed],
        };
    },
    extensions: [".ts"],
    heals: true,
    invariant:
        "every rule source declares the full contract and emits findings in the machine-actionable shape, and every report on disk is claimed by something that emits it",
    jurisdiction: "taxonomy",
    kinds: [
        "ruleContract",
        "declarationContract",
        "orphanReport",
        "unsanctionedWriter",
        "staleChannel",
        "unevaluableScope",
        "unrepairableLocus",
        "matching",
    ],
    readsTree:
        "a channel names the SCOPE its run declared, and whether that scope still resolves is a question about " +
        "the TREE rather than about any file's contents — a scope naming a subtree is answered by whether the " +
        "subtree is there, which no set of scanned file contents can decide. The reports this walk reads are " +
        "generated output and sit outside the governed path set by construction, so a rule reading only that " +
        "set would report a clean green over every report and every channel in the directory the pipeline " +
        "writes",

    stage: "meta",

    wholeScopeOnly: true,
};
