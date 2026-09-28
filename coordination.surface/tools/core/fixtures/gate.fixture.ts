import { surfacePath } from "../../../config/surface.config.ts";
import { BEHAVIOUR_TREE_PLACEHOLDER } from "../constants/path.constants.ts";
import { BLOCKING_SUFFIX } from "../constants/blocking.constants.ts";
import { INSTALL_ROOT } from "../constants/dependency.constants.ts";
import { channelReportName } from "../reporters/rule.reporter.ts";
import { SCHEDULE_DIVIDER, SCHEDULE_HEADER } from "../constants/agenda.constants.ts";
import { inCore, inEntrypoints, inGenerated, inRules, inSurface, RULES_DIGESTS } from "./path.fixture.ts";

import type { GateFixture } from "../types/fixture.types.ts";

const FROZEN_TARGET = `${surfacePath("archive")}/a-settled-argument.md`;

const ACCUMULATING_SURFACE = inSurface(`a-probe-discussion${BLOCKING_SUFFIX}`);

const CHANNEL_ONE = "rule=a-probe-scope";

const CHANNEL_TWO = "rule=a-second-probe-scope";

function channelText(scope: string): string {
    return `${JSON.stringify({ tool: "govern", authoritative: false, verdict: "pass", scope })}\n`;
}

const VALID_RULE =
    "export const rule = {\n" +
    '    stage: "meta",\n' +
    '    jurisdiction: "all",\n' +
    '    invariant: "probe",\n' +
    "    extensions: [],\n" +
    '    kinds: ["probeKind"],\n' +
    "    heals: false,\n" +
    "    check(context) { return { findings: [], healed: [], scanned: context.paths.length }; },\n" +
    "};\n";

const ROOT_RESOLUTION_EXEMPT =
    "its subject is whether a DECLARED root resolves to a directory that exists, and a declared directory " +
    "holding no files contributes no paths at all — so the violating case is precisely the one a synthetic " +
    "path set cannot represent: the violation is the ABSENCE of a directory, and a sample supplies a file " +
    "rather than an absence. The exemption is stated at KIND granularity as well as at rule granularity " +
    "because the unfixtured scan quantifies over KINDS, so a rule-level exemption clears the rule and " +
    "leaves each of its kinds counted — which is the same operand mismatch that lets a green read as " +
    "coverage over a set the check never ranged on";

const PROBE_RULE = inRules("probe.rule.ts");

const PROBE_CONSTANTS = inCore("constants/probe.constants.ts");

const PROBE_ENTRYPOINT = inEntrypoints("probe.entrypoint.ts");

const INSTALLED_PROBE = inSurface(`${INSTALL_ROOT}/a-package/package.json`);

const CONDUCT_ROSTER = `${RULES_DIGESTS}conduct.rule.md`;


const PROBE_VENUE = inSurface(`probe${BLOCKING_SUFFIX}`);

const AGENDA_SURFACE = surfacePath("agenda");

const SCHEDULE_REGION = `${SCHEDULE_HEADER}\n${SCHEDULE_DIVIDER}\n`;

const PLACEHOLDER_CITING_DOC = {
    path: inSurface("probe.md"),
    text: `See \`${BEHAVIOUR_TREE_PLACEHOLDER}/rules/probe.rule.md\`.\n`,
};

export const FIXTURES: readonly GateFixture[] = [
    {
        rule: "declaration",
        kind: "unrenamedPlaceholder",
        onDisk: true,
        fires: [PLACEHOLDER_CITING_DOC],
        passes: [
            PLACEHOLDER_CITING_DOC,
            { path: inSurface(`${BEHAVIOUR_TREE_PLACEHOLDER}/rules/probe.rule.md`), text: "probe\n" },
        ],
    },
    {
        rule: "declaration",
        kind: "missingRoot",
        exempt: ROOT_RESOLUTION_EXEMPT,
    },
    {
        rule: "declaration",
        kind: "missingContainer",
        exempt: ROOT_RESOLUTION_EXEMPT,
    },
    {
        rule: "declaration",
        kind: "missingCorpusSubtree",
        exempt: ROOT_RESOLUTION_EXEMPT,
    },
    {
        rule: "declaration",
        kind: "missingUpstreamRoot",
        exempt: ROOT_RESOLUTION_EXEMPT,
    },
    {
        rule: "channel",
        kind: "nameScopeDisagreement",
        onDisk: true,
        fires: [{ path: inGenerated(channelReportName(CHANNEL_ONE)), text: channelText(CHANNEL_TWO) }],
        passes: [{ path: inGenerated(channelReportName(CHANNEL_ONE)), text: channelText(CHANNEL_ONE) }],
    },
    {
        rule: "channel",
        kind: "scopeCollision",
        onDisk: true,
        fires: [
            { path: inGenerated(channelReportName(CHANNEL_ONE)), text: channelText(CHANNEL_TWO) },
            { path: inGenerated(channelReportName(CHANNEL_TWO)), text: channelText(CHANNEL_TWO) },
        ],
        passes: [
            { path: inGenerated(channelReportName(CHANNEL_ONE)), text: channelText(CHANNEL_ONE) },
            { path: inGenerated(channelReportName(CHANNEL_TWO)), text: channelText(CHANNEL_TWO) },
        ],
    },
    {
        rule: "declaration",
        kind: "declaredRuntimeDependency",
        onDisk: true,
        fires: [{ path: inSurface("package.json"), text: '{"name":"probe","dependencies":{"a-package":"^1.0.0"}}\n' }],
        passes: [{ path: inSurface("package.json"), text: '{"name":"probe","dependencies":{}}\n' }],
    },
    {
        rule: "declaration",
        kind: "unreachedDependency",
        onDisk: true,
        fires: [
            {
                path: inSurface("package.json"),
                text: '{"name":"probe","devDependencies":{"a-package":"^1.0.0"},"scripts":{"one":"node run.ts"}}\n',
            },
            { path: INSTALLED_PROBE, text: '{"name":"a-package","bin":{"a-tool":"./cli.js"}}\n' },
        ],
        passes: [
            {
                path: inSurface("package.json"),
                text: '{"name":"probe","devDependencies":{"a-package":"^1.0.0"},"scripts":{"one":"a-tool run"}}\n',
            },
            { path: INSTALLED_PROBE, text: '{"name":"a-package","bin":{"a-tool":"./cli.js"}}\n' },
        ],
    },
    {
        rule: "entrypoint",
        kind: "healingIsOptIn",
        fires: [{ path: PROBE_ENTRYPOINT, text: 'const on = argv.includes("--fix");\n' }],
        passes: [{ path: PROBE_ENTRYPOINT, text: 'const off = argv.includes("--no-fix");\n' }],
    },
    {
        rule: "secret",
        kind: "secretOutsideItsBearer",
        exempt:
            "the violating sample IS a credential-shaped token, and this file is scanned by the rule it would " +
            "prove — so the fixture fires on itself and a credential-shaped literal lives in the tree " +
            "permanently, which is the outcome the rule exists to prevent. A surface that must CONTAIN a " +
            "construct in order to test it is matched by the detector for that construct, and excluding this " +
            "file by path would install a blind spot shaped exactly like the thing being hidden",
        fires: [],
        passes: [],
    },
    {
        rule: "declaration",
        kind: "foreignGrammarClaimed",
        exempt:
            "its subject is a DIRECTORY carrying another system's ownership marker while being declared a " +
            "governed root — a fact about a real tree's contents and its declaration at once, which a " +
            "synthetic path set cannot hold: the violation is that the directory EXISTS and is claimed, and a " +
            "sample supplies neither",
        fires: [],
        passes: [],
    },
    {
        rule: "declaration",
        kind: "unresolvedArtifactRoot",
        exempt:
            "it resolves a declared binding through a file on disk to a directory that must exist, so the " +
            "violation is the absence of a resolution target rather than the content of any file — the same " +
            "reason the rule as a whole cannot be fixtured, stated at kind granularity",
        fires: [],
        passes: [],
    },
    {
        rule: "governance",
        kind: "orphanReport",
        onDisk: true,
        fires: [
            {
                path: inGenerated("nosuchrule.report.generated.json"),
                text: '{"rule":"nosuchrule","stage":"meta","verdict":"pass","findings":[]}\n',
            },
        ],
        passes: [
            {
                path: inGenerated("probe.report.generated.json"),
                text: '{"rule":"probe","stage":"meta","verdict":"pass","findings":[]}\n',
            },
            { path: inRules("probe.rule.ts"), text: 'export const rule = {\n    id: "probe",\n};\n' },
        ],
        heals: [
            {
                path: inGenerated("nosuchrule.report.generated.json"),
                text: '{"rule":"nosuchrule","stage":"meta","verdict":"pass","findings":[]}\n',
            },
        ],
    },
    {
        rule: "governance",
        kind: "unsanctionedWriter",
        exempt:
            "its subject is a module REACHABLE FROM A RUN, so the violation is a path through the real import " +
            "graph from the pipeline entry point rather than the content of any file — a synthetic sample sits " +
            "in no graph and is reached by nothing, and a sample the walk could reach would have to BE the tree. " +
            "It is proven instead by withdrawing one verified writer from the sanctioned set and watching the " +
            "walk name that module and no other, which is the same break-it-and-watch evidence at the operand " +
            "the check actually ranges over",
        fires: [],
        passes: [],
    },
    {
        rule: "governance",
        kind: "staleChannel",
        onDisk: true,
        fires: [
            {
                path: inGenerated("pipeline.rule~23da-check-nothing-registers.report.generated.json"),
                text: '{"tool":"govern","authoritative":false,"verdict":"pass","scope":"rule=a-check-nothing-registers"}\n',
            },
        ],
        passes: [
            {
                path: inGenerated("pipeline.rule~23dprobe.report.generated.json"),
                text: '{"tool":"govern","authoritative":false,"verdict":"pass","scope":"rule=probe"}\n',
            },
            { path: inRules("probe.rule.ts"), text: 'export const rule = {\n    id: "probe",\n};\n' },
        ],
        heals: [
            {
                path: inGenerated("pipeline.rule~23da-check-nothing-registers.report.generated.json"),
                text: '{"tool":"govern","authoritative":false,"verdict":"pass","scope":"rule=a-check-nothing-registers"}\n',
            },
        ],
    },
    {
        rule: "governance",
        kind: "undeclaredExclusion",
        onDisk: true,
        fires: [
            {
                path: inGenerated("probe.report.generated.json"),
                text:
                    '{"rule":"probe","stage":"meta","verdict":"pass","scanned":9,"findings":[],' +
                    '"derivations":{"reached":["a.md","b.md"]}}\n',
            },
            { path: inRules("probe.rule.ts"), text: 'export const rule = {\n    id: "probe",\n};\n' },
        ],
        passes: [
            {
                path: inGenerated("probe.report.generated.json"),
                text:
                    '{"rule":"probe","stage":"meta","verdict":"pass","scanned":4,"findings":[],' +
                    '"derivations":{"reached":["a.md","b.md"],"skippedAsTransient":["c.md","d.md"]}}\n',
            },
            { path: inRules("probe.rule.ts"), text: 'export const rule = {\n    id: "probe",\n};\n' },
        ],
    },
    {
        rule: "governance",
        kind: "unusableOperand",
        onDisk: true,
        fires: [
            {
                path: inGenerated("probe.report.generated.json"),
                text:
                    '{"rule":"probe","stage":"meta","verdict":"pass","scanned":9,"findings":[],' +
                    '"derivations":{"reached":2,"membersWalked":["a.md","b.md"]}}\n',
            },
            { path: inRules("probe.rule.ts"), text: 'export const rule = {\n    id: "probe",\n};\n' },
        ],
        passes: [
            {
                path: inGenerated("probe.report.generated.json"),
                text:
                    '{"rule":"probe","stage":"meta","verdict":"pass","scanned":9,"findings":[],' +
                    '"derivations":{"membersWalked":["a.md","b.md"]}}\n',
            },
            { path: inRules("probe.rule.ts"), text: 'export const rule = {\n    id: "probe",\n};\n' },
        ],
    },
    {
        rule: "governance",
        kind: "unevaluableScope",
        onDisk: true,
        fires: [
            {
                path: inGenerated("probe.report.generated.json"),
                text: '{"rule":"probe","stage":"meta","verdict":"pass","scanned":9,"findings":[]}\n',
            },
            { path: inRules("probe.rule.ts"), text: 'export const rule = {\n    id: "probe",\n};\n' },
        ],
        passes: [
            {
                path: inGenerated("probe.report.generated.json"),
                text:
                    '{"rule":"probe","stage":"meta","verdict":"pass","scanned":9,"findings":[],' +
                    '"derivations":{"declarationsWalked":["one","two"]}}\n',
            },
            { path: inRules("probe.rule.ts"), text: 'export const rule = {\n    id: "probe",\n};\n' },
        ],
    },
    {
        rule: "entrypoint",
        kind: "unwitnessedWrite",
        fires: [
            {
                path: PROBE_ENTRYPOINT,
                text: "const before = readFileSync(target);\nconst next = transform(before);\nwriteFileSync(target, next);\n",
            },
        ],
        passes: [
            {
                path: PROBE_ENTRYPOINT,
                text:
                    "const before = readFileSync(target);\nconst next = transform(before);\n" +
                    "const witness = readFileSync(target);\nif (witness !== before) return;\nwriteFileSync(target, next);\n",
            },
        ],
    },
    {
        rule: "entrypoint",
        kind: "unpublishedBranchOperand",
        fires: [
            {
                path: PROBE_ENTRYPOINT,
                text:
                    "const heal = asked && peers < 2;\nconst result = runPipeline({\n    fix: heal,\n});\n" +
                    "const report: PipelineReport = {\n    verdict: result.verdict,\n};\n" +
                    "const target = writePipelineReport(REPO_ROOT, report);\n",
            },
        ],
        passes: [
            {
                path: PROBE_ENTRYPOINT,
                text:
                    "const heal = asked && peers < 2;\nconst result = runPipeline({\n    fix: heal,\n});\n" +
                    "const report: PipelineReport = {\n    verdict: result.verdict,\n    mutated: heal,\n};\n" +
                    "const target = writePipelineReport(REPO_ROOT, report);\n",
            },
        ],
    },
    {
        rule: "governance",
        kind: "unrepairableLocus",
        onDisk: true,
        fires: [
            {
                path: inGenerated("probe.report.generated.json"),
                text:
                    '{"rule":"probe","stage":"meta","verdict":"fail","scanned":9,"findings":[{"rule":"probe/marker",' +
                    `"path":"${ACCUMULATING_SURFACE}","line":4,"locus":"A-1","stack":[],"actual":"a matched marker",` +
                    '"expected":null,"remediation":{"action":"none","from":"a marker","to":null,' +
                    `"target":"${ACCUMULATING_SURFACE}","deterministic":false,"decide":"restate it"},"healed":false}],` +
                    `"derivations":{"reached":["${ACCUMULATING_SURFACE}"]}}\n`,
            },
            { path: inRules("probe.rule.ts"), text: 'export const rule = {\n    id: "probe",\n};\n' },
        ],
        passes: [
            {
                path: inGenerated("probe.report.generated.json"),
                text:
                    '{"rule":"probe","stage":"meta","verdict":"fail","scanned":9,"findings":[{"rule":"probe/marker",' +
                    `"path":"${ACCUMULATING_SURFACE}","line":4,"locus":"A","stack":[],"actual":"a matched marker",` +
                    '"expected":null,"remediation":{"action":"none","from":"a marker","to":null,' +
                    `"target":"${ACCUMULATING_SURFACE}","deterministic":false,"decide":"rewrite the field"},"healed":false}],` +
                    `"derivations":{"reached":["${ACCUMULATING_SURFACE}"]}}\n`,
            },
            { path: inRules("probe.rule.ts"), text: 'export const rule = {\n    id: "probe",\n};\n' },
        ],
    },
    {
        rule: "governance",
        kind: "unrepairableLocus",
        onDisk: true,
        fires: [
            {
                path: inGenerated("probe.report.generated.json"),
                text:
                    '{"rule":"probe","stage":"meta","verdict":"fail","scanned":9,"findings":[{"rule":"probe/marker",' +
                    `"path":"${FROZEN_TARGET}","line":4,"locus":"a marker","stack":[],"actual":"a matched marker",` +
                    '"expected":null,"remediation":{"action":"none","from":"a marker","to":null,' +
                    `"target":"${FROZEN_TARGET}","deterministic":false,"decide":"rewrite it"},"healed":false}],` +
                    `"derivations":{"reached":["${FROZEN_TARGET}"]}}\n`,
            },
            { path: inRules("probe.rule.ts"), text: 'export const rule = {\n    id: "probe",\n};\n' },
        ],
        passes: [
            {
                path: inGenerated("probe.report.generated.json"),
                text:
                    '{"rule":"probe","stage":"meta","verdict":"fail","scanned":9,"findings":[{"rule":"probe/marker",' +
                    '"path":"a-live-surface.md","line":4,"locus":"a marker","stack":[],"actual":"a matched marker",' +
                    '"expected":null,"remediation":{"action":"none","from":"a marker","to":null,' +
                    '"target":"a-live-surface.md","deterministic":false,"decide":"rewrite it"},"healed":false}],' +
                    '"derivations":{"reached":["a-live-surface.md"]}}\n',
            },
            { path: inRules("probe.rule.ts"), text: 'export const rule = {\n    id: "probe",\n};\n' },
        ],
    },
    {
        rule: "entrypoint",
        kind: "presenceBackedMutationGuard",
        fires: [
            {
                path: PROBE_ENTRYPOINT,
                text:
                    "function seated(root) {\n    return activeAgents(readFileSync(root), bound);\n}\n" +
                    "const peers = seated(REPO_ROOT);\nconst heal = asked && peers < 2;\n" +
                    "const result = runPipeline({\n    fix: heal,\n});\n",
            },
        ],
        passes: [
            {
                path: PROBE_ENTRYPOINT,
                text:
                    "const standing = claimStanding(REPO_ROOT, scope, runAt, runAgent);\n" +
                    "const heal = asked && standing.overlapping.length === 0;\n" +
                    "const result = runPipeline({\n    fix: heal,\n});\n",
            },
        ],
    },
    {
        rule: "entrypoint",
        kind: "secondPipelineEntry",
        fires: [
            { path: PROBE_ENTRYPOINT, text: "await runPipeline(options);\n" },
            { path: inEntrypoints("second.entrypoint.ts"), text: "await runPipeline(options);\n" },
        ],
        passes: [
            { path: PROBE_ENTRYPOINT, text: "await runPipeline(options);\n" },
            { path: inEntrypoints("second.entrypoint.ts"), text: "await runNarrowedStage(options);\n" },
        ],
    },
    {
        rule: "governance",
        kind: "ruleContract",
        onDisk: true,
        fires: [
            { path: PROBE_RULE, text: `import { readFileSync } from "node:fs";\n${VALID_RULE}` },
            {
                path: inGenerated("probe.report.generated.json"),
                text: '{"rule":"probe","stage":"meta","verdict":"pass","scope":"whole","authoritative":true,"findings":[]}\n',
            },
        ],
        passes: [
            { path: PROBE_RULE, text: VALID_RULE },
            {
                path: inGenerated("probe.report.generated.json"),
                text: '{"rule":"probe","stage":"meta","verdict":"pass","scope":"whole","authoritative":true,"findings":[]}\n',
            },
        ],
    },
    {
        rule: "governance",
        kind: "matching",
        fires: [
            {
                path: PROBE_RULE,
                text: "export const at = (text: string): number => text.search(/[^A-Za-z]/);\n",
            },
        ],
        passes: [
            {
                path: PROBE_RULE,
                text: 'export const at = (text: string): number => text.indexOf(" ");\n',
            },
        ],
    },
    {
        rule: "verdict",
        kind: "middleTier",
        fires: [{ path: PROBE_RULE, text: 'const TIER = "warning";\n' }],
        passes: [{ path: PROBE_RULE, text: 'const TIER = "fail";\n' }],
    },
    {
        rule: "verdict",
        kind: "vocabularyEscape",
        fires: [{ path: PROBE_CONSTANTS, text: 'export const LEVELS = ["info", "warning"];\n' }],
        passes: [
            { path: PROBE_CONSTANTS, text: 'export const LEVELS = ["info", "warning"];\n' },
            {
                path: PROBE_RULE,
                text: 'import { LEVELS } from "../core/constants/probe.constants.ts";\nexport const rule = LEVELS;\n',
            },
        ],
    },
    {
        rule: "conduct",
        kind: "unstatedHalf",
        fires: [{ path: CONDUCT_ROSTER, text: "| `probe_slug` | what a check would need |\n" }],
        passes: [{ path: CONDUCT_ROSTER, text: "| `probe_slug` | what a check would need | `—` |\n" }],
    },
    {
        rule: "conduct",
        kind: "unresolvedObserver",
        fires: [
            { path: CONDUCT_ROSTER, text: "| `probe_slug` | what a check would need | `absent-probe` |\n" },
            { path: PROBE_RULE, text: 'export const rule = {\n    id: "probe",\n};\n' },
        ],
        passes: [
            { path: CONDUCT_ROSTER, text: "| `probe_slug` | what a check would need | `probe` |\n" },
            { path: PROBE_RULE, text: 'export const rule = {\n    id: "probe",\n};\n' },
        ],
    },
    {
        rule: "literal",
        kind: "unboundedEnumeration",
        fires: [
            {
                path: PROBE_RULE,
                text: 'const held = readdirSync(repoRoot, { recursive: true, encoding: "utf8" });\n',
            },
        ],
        passes: [
            {
                path: PROBE_RULE,
                text: 'const held = readdirSync(resolve(repoRoot, surfacePrefix()), { recursive: true, encoding: "utf8" });\n',
            },
        ],
    },
    {
        rule: "agenda",
        kind: "transcribedState",
        exempt:
            "the healing branch compares the typed plan in the agenda configuration with the rendered table, and the " +
            "plan is compiled into the package rather than read from the tree, so a seeded tree cannot supply one. " +
            "The package ships the plan empty, because a schedule is a deployment's own state, so there is no row " +
            "whose state can drift. The branch runs on a deployment's first planned row, where a hand-edited state " +
            "cell is healed on the next run and published in the rule's rowsWalked derivation",
    },
    {
        rule: "agenda",
        kind: "tableAbsent",
        onDisk: true,
        fires: [{ path: AGENDA_SURFACE, text: "the agenda's prose with no ordering table beneath it\n" }],
        passes: [{ path: AGENDA_SURFACE, text: SCHEDULE_REGION }],
    },
    {
        rule: "venue",
        kind: "fencedOnlySuccessor",
        fires: [{ path: PROBE_VENUE, text: "READ AND AWAITING: Z\n\n```\nSUCCESSOR: probe-invariant\n```\n" }],
        passes: [
            {
                path: PROBE_VENUE,
                text: "READ AND AWAITING: Z\n\n```\nSUCCESSOR: <invariant-name>\n```\n\nSUCCESSOR: probe-invariant\n",
            },
        ],
    },
    {
        rule: "converge",
        kind: "unimplementedStep",
        exempt:
            "both operands are DECLARED SETS rather than tree content — the standing preconditions this check " +
            "classifies, and the step ids the tool declares for the edges it walks and the move it performs — so a " +
            "seeded sample can vary neither and a firing half cannot exist. That is the price of the repair rather " +
            "than a gap left in it: the earlier pair fired on a synthetic source because the mechanism was a TOKEN " +
            "SCAN over file text, which is precisely what made the check decide its subject by word presence and " +
            "read green for a step implemented under a callee name carrying no matching token. A fixture is only " +
            "worth what its mechanism is worth, so a samplable pair over the wrong mechanism is weaker evidence " +
            "than an exemption over the right one. The ACCEPTING half is live on the real population and is named " +
            "in the check's own derivations, which publish both sets and their difference on every run; the FIRING " +
            "half is reachable the moment the two surfaces diverge, which is the state the check exists for and the " +
            "one no fixture can seed while both sets compile into one package",
    },
];
