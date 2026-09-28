import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { projectRoot, surfacePath } from "../../../config/surface.config.ts";
import { AGENT_FIELDS, PROJECTION_CAP_CHARS, PROJECTION_HOST } from "../constants/board.constants.ts";
import { BINDING_PATH } from "../constants/binding.constants.ts";
import { BLOCKING_SUFFIX } from "../constants/blocking.constants.ts";
import { AGENT_ROOT, MANDATORY_GATES, ROLE_TEMPLATE, SKILL_ROOT, TEMPLATE_ROOT } from "../constants/template.constants.ts";
import { roleFieldsFrom, roleSectionsFrom, roleSubsectionsFrom } from "../inspectors/role.inspector.ts";
import { readSource } from "../iterators/file.iterator.ts";
import {
    ACCUMULATOR,
    AGENDA,
    AGENT_INDEX,
    BOARD,
    BOARD_TEMPLATE,
    CHECKLIST_TEMPLATE,
    AXIS_DOCUMENT,
    HOST_DOCUMENT,
    inCore,
    inGenerated,
    inPlanning,
    inRoles,
    inRules,
    inSurface,
    RULES_DIGESTS,
} from "./path.fixture.ts";

const PROJECTION_HOST_ABSENT = PROJECTION_HOST === null;

const PROJECTION_EXEMPT =
    "the projection host slot resolves ABSENT, so the branch reading it does not run and no fixture can " +
    "make this kind fire. That is the slot rule holding rather than a coverage gap — a fixture forcing it " +
    "would have to fabricate the host, which is a check supplying its own evidence. An adopting host " +
    "resolves the slot and the exemption lifts with no edit here, because it is DERIVED from the slot";

function projectionFixture(kind: string, violating: string, extra: readonly Sample[] = []): GateFixture {
    if (PROJECTION_HOST_ABSENT) return { rule: "board", kind, exempt: PROJECTION_EXEMPT };

    return {
        rule: "board",
        kind,
        fires: [{ path: HOST_DOCUMENT, text: violating }, ...extra, { path: BOARD, text: FULL_RECORD }],
        passes: [
            { path: HOST_DOCUMENT, text: "collab-status: current, identity.blocking.md open\n" },
            ...extra,
            { path: BOARD, text: FULL_RECORD },
        ],
    };
}

const ROLE_TEMPLATE_SOURCE = ((): string => {
    const absolute = resolve(projectRoot(), ROLE_TEMPLATE);
    return existsSync(absolute) ? readSource(absolute) : "";
})();

const ROLE_SECTIONS = roleSectionsFrom(ROLE_TEMPLATE_SOURCE);

const ROLE_SUBSECTIONS = roleSubsectionsFrom(ROLE_TEMPLATE_SOURCE);

const VENUE_BODY = "# Probe\n\n## Exit condition\n\nDeleted on converge.\n";

const VENUE_ARCHIVE_TAIL = "_archive/venues";

const CONDUCT_REGISTRY_PATH = `${RULES_DIGESTS}conduct.rule.md`;

const CLEAN_REGISTRY = "# Unobservable rules\n\n| slug | what a check would need | checkable half |\n|---|---|---|\n";

const INDEXED_PROBE_LETTER = "| letter | role | state |\n|---|---|---|\n| SAa | Probe agent | ACTIVE |\n";

const AGENT_TEMPLATE_BASENAME = "agent.protocol.template.md";

const BEHAVIOUR_TREE_ROOT = surfacePath("behaviour_tree");

function inTree(path: string): string {
    return `${BEHAVIOUR_TREE_ROOT}/${path}`;
}

const EXECUTED_HEAD = "tel-priority constrain ver-stop ter-stop\n";

function fromDisk(path: string): string {
    const absolute = resolve(projectRoot(), path);
    return existsSync(absolute) ? readSource(absolute) : "";
}

const BINDING_SAMPLE: Sample = { path: BINDING_PATH, text: fromDisk(BINDING_PATH) };

const ROLE_TEMPLATE_SAMPLE: Sample = { path: ROLE_TEMPLATE, text: ROLE_TEMPLATE_SOURCE };

const BOARD_TEMPLATE_SAMPLE: Sample = { path: BOARD_TEMPLATE, text: fromDisk(BOARD_TEMPLATE) };

const AGENT_INDEX_SAMPLE: Sample = { path: AGENT_INDEX, text: fromDisk(AGENT_INDEX) };

function agentBody(letter: string): string {
    return (
        `---\nname: probe-${letter}\n---\n` +
        `THIS AGENT IS ${letter}.\n` +
        "SKILLS: collaboration-protocol\n" +
        "tel-priority constrain ver-stop ter-stop\n"
    );
}

const REGISTERED_PROBE_GATE: Sample = {
    path: inRules("probe.rule.ts"),
    text: 'export const rule = {\n    id: "probe",\n};\n',
};

function slugLine(slug: string, gate: string): string {
    return `- \`${slug}\`: a probe directive · gate: ${gate}\n`;
}

const LIFETIME_PROBE = `${surfacePath("models")}/probe.model.md`;

const VENUE_TEMPLATE_PATH = surfacePath("venue_template");

const VENUE_TEMPLATE_SOURCE = ((): string => {
    const absolute = resolve(projectRoot(), VENUE_TEMPLATE_PATH);
    return existsSync(absolute) ? readSource(absolute) : "";
})();

const ROLE_HEAD = `---\n${roleFieldsFrom(ROLE_TEMPLATE_SOURCE)
    .map((field) => (field.endsWith(":") ? `${field} probe` : field))
    .join("\n")}\n---\n\n`;

const FULL_RECORD =
    "┌─── AGENT D ───\nAgent D — ACTIVE\n  Owns:    probe\n  Status:  probe\n  Flags:   —\n  Refs:    —\n└─── END AGENT D\n";

const REPEATED = `${"one claim stated twice over enough words to register as a span ".repeat(2)}`;

const RECORD_DOC = inTree("intel/references/base.reference.md");

const PRELOADING_AGENT = {
    path: `${AGENT_ROOT}probe.SAa.md`,
    text:
        "---\nname: probe-SAa\n---\n" +
        "THIS AGENT IS SAa.\n" +
        "SKILLS: collaboration-protocol\n" +
        "tel-priority constrain ver-stop ter-stop\n",
};
import type { GateFixture, Sample } from "../types/fixture.types.ts";

const RECORD_HEAD =
    "---\nid: base\ntitle: base\ndomain: architecture\nowner: x\ntags: [a]\nupdated: 2026-08-16\n" +
    "confidence: high\nsources:\n  S1: x\n---\n\n";

const ROW_FIELDS = "*file:* x · *evidence:* y · *owner:* A · *verifier:* A · *not:* z · *done:* w";

const TASK = `### PHASE \`structure-probe\`\n- [ ] 1.1.1 DO it. ${ROW_FIELDS}\n`;

const LATER_TASK =`- [ ] 2.1.1 DO it later. ${ROW_FIELDS}\n`;

export const DOCUMENT_FIXTURES: readonly GateFixture[] = [
    {
        rule: "surface",
        kind: "noWritePath",
        exempt:
            "both operands are the PARAMETER SURFACE and the tool's own target resolution rather than tree " +
            "content, so a seeded tree cannot vary either and a fires-and-passes pair cannot exist — a " +
            "fixture forcing it would have to fabricate a configuration, which is a check supplying its own " +
            "evidence. The kind is proven on its REAL population instead, and both halves are named by path " +
            "in its own report: it fires on every declared surface a refusing mechanism requires and no tool " +
            "write path reaches, and ACCEPTS the board, which is mandated and reached. The exemption is " +
            "DERIVED from where the operands live, so a check whose subject moves into the tree loses it " +
            "with no edit here",
    },
    {
        rule: "surface",
        kind: "unretractableWriteRegion",
        exempt:
            "both operands are CONSTANTS in the walk's own source — the assessed-form map and the classified-region " +
            "registry — so a seeded tree varies neither and a fires-and-passes pair over one would be the check " +
            "supplying its own evidence. The FIRED half is proven on the real population and named by region in the " +
            "walk's own report. The ACCEPTED half is proven on the region whose form removes one deferred clause by " +
            "name, which clears for the reason the kind tests rather than because nothing reached it. The exemption " +
            "stands on one thing only — a step registers no declaration, so nothing judges this entry — and both " +
            "halves are proven on the real population",
    },
    {
        rule: "surface",
        kind: "unassessedWriteForm",
        onDisk: true,
        fires: [
            {
                path: inCore("entrypoints/board.entrypoint.ts"),
                text: 'const flag = argumentValue("--agent");\nconst probe = argumentValue("--probeform");\n',
            },
        ],
        passes: [
            {
                path: inCore("entrypoints/board.entrypoint.ts"),
                text: 'const flag = argumentValue("--agent");\nconst named = argumentValue("--file");\n',
            },
        ],
    },
    {
        rule: "vocabulary",
        kind: "undeclaredValue",
        fires: [
            {
                path: LIFETIME_PROBE,
                text: "| section | axis | value |\n|---|---|---|\n| positions | retention | kept-forever |\n",
            },
        ],
        passes: [
            {
                path: LIFETIME_PROBE,
                text: "| section | axis | value |\n|---|---|---|\n| positions | retention | accumulating |\n",
            },
        ],
    },
    {
        rule: "snapshot",
        kind: "shortenedGovernedSurface",
        exempt:
            "PROVEN AT THE BRANCH POPULATION RATHER THAN EXEMPT. A branch fixture seeds a prior extent " +
            "naming a governed surface with both its record anchors, seeds that surface carrying one, exercises " +
            "the step against the grown root, and asserts the emitted kind, its locus and the VERDICT the step " +
            "published — so the firing half is demonstrated on a tree built for it rather than waited for on the " +
            "live one. The prior extent reaches a seeded tree because the resolver takes the TREE ROOT it is " +
            "handed, so a seeded report supplies it like any other file; and the branch population proves a step " +
            "by its effect on a seeded root although a step registers no declaration. THE ACCEPTING HALF IS " +
            "PROVEN TWICE: by a branch asserting the unchanged verdict on a surface whose extent it still " +
            "matches, and on the real population, where every surface whose declaration forbids removal is " +
            "compared against its retained extent and published as unchanged or first-seen",
    },
    {
        rule: "snapshot",
        kind: "frozenSurfaceWritten",
        exempt:
            "PROVEN AT THE BRANCH POPULATION ON BOTH HALVES, like its sibling. A branch " +
            "seeds a path under the declared archive root carrying two record anchors and a prior extent naming " +
            "both, and the step reports unchanged; the same extent against that path carrying one anchor reports " +
            "this kind, naming the absent member as its locus. Lifetime resolves from the PATH, so a path grown " +
            "under the archive root in a seeded tree carries the frozen declaration exactly as the real one does: " +
            "the sample is not a copy of a frozen surface, it IS one. THE ACCEPTING HALF IS ALSO LIVE on the real population, where every archived " +
            "surface is compared in both directions on every whole-scope run and published as unchanged",
    },
    {
        rule: "emission",
        kind: "unresolvedSlug",
        onDisk: true,
        fires: [
            { path: AXIS_DOCUMENT, text: `## Always\n\n${slugLine("a_rule_this_sample_declares", "conduct")}` },
            {
                path: inCore("entrypoints/probe.entrypoint.ts"),
                text: 'export const RESTATES: readonly string[] = ["a_rule_no_axis_document_declares"];\n',
            },
        ],
        passes: [
            { path: AXIS_DOCUMENT, text: `## Always\n\n${slugLine("a_rule_this_sample_declares", "conduct")}` },
            {
                path: inCore("entrypoints/probe.entrypoint.ts"),
                text: 'export const RESTATES: readonly string[] = ["a_rule_this_sample_declares"];\n',
            },
        ],
    },
    {
        rule: "reference",
        kind: "unresolved",
        onDisk: true,
        fires: [
            {
                path: RULES_DIGESTS + "base.rule.md",
                text: `see \`${RULES_DIGESTS}absent-probe.rule.md\` for detail\n`,
            },
        ],
        passes: [
            {
                path: RULES_DIGESTS + "base.rule.md",
                text: `see \`${RULES_DIGESTS}probe.rule.md\` for detail\n`,
            },
            { path: RULES_DIGESTS + "probe.rule.md", text: "the cited rule\n" },
        ],
    },
    {
        rule: "literal",
        kind: "rawPath",
        onDisk: true,
        fires: [
            {
                path: inCore("constants/probe.constants.ts"),
                text: 'import { join } from "node:path";\n\nexport const PROBE = join("elsewhere", "rules");\n',
            },
        ],
        passes: [
            {
                path: inCore("constants/probe.constants.ts"),
                text: 'import { surfacePath } from "../../../config/surface.config.ts";\n\nexport const PROBE = surfacePath("rules");\n',
            },
        ],
    },
    {
        rule: "purity",
        kind: "leafClimbsOut",
        onDisk: true,
        fires: [
            {
                path: inCore("constants/probe.constants.ts"),
                text: 'import { PROBE_SOURCE } from "../readers/probe.reader.ts";\n\nexport const PROBE = PROBE_SOURCE;\n',
            },
            { path: inCore("readers/probe.reader.ts"), text: 'export const PROBE_SOURCE = "above the leaf tier";\n' },
        ],
        passes: [
            {
                path: inCore("constants/probe.constants.ts"),
                text: 'import { PROBE_SOURCE } from "./probe-peer.constants.ts";\n\nexport const PROBE = PROBE_SOURCE;\n',
            },
            {
                path: inCore("constants/probe-peer.constants.ts"),
                text: 'export const PROBE_SOURCE = "inside the leaf tier";\n',
            },
        ],
    },
    {
        rule: "reference",
        kind: "citationCycle",
        onDisk: true,
        fires: [
            {
                path: RULES_DIGESTS + "base.rule.md",
                text: `see \`${RULES_DIGESTS}probe.rule.md\` for detail\n`,
            },
            {
                path: RULES_DIGESTS + "probe.rule.md",
                text: `see \`${RULES_DIGESTS}base.rule.md\` for detail\n`,
            },
        ],
        passes: [
            {
                path: RULES_DIGESTS + "base.rule.md",
                text: `see \`${RULES_DIGESTS}probe.rule.md\` for detail\n`,
            },
            { path: RULES_DIGESTS + "probe.rule.md", text: "the cited rule, citing nothing back\n" },
        ],
    },
    {
        rule: "record",
        kind: "missingKey",
        fires: [
            {
                path: RECORD_DOC,
                text: `${RECORD_HEAD}### ARC-910\ntype: fact\nsubject: a.b\nstatement: One.\nsource: S1\n`,
            },
        ],
        passes: [
            {
                path: RECORD_DOC,
                text: `${RECORD_HEAD}### ARC-910\ntype: fact\nsubject: a.b\nstatement: One.\nconfidence: community\nsource: S1\n`,
            },
        ],
    },
    {
        rule: "record",
        kind: "unknownTier",
        fires: [
            {
                path: RECORD_DOC,
                text: `${RECORD_HEAD}### ARC-911\ntype: fact\nsubject: a.b\nstatement: One.\nconfidence: probably\nsource: S1\n`,
            },
        ],
        passes: [
            {
                path: RECORD_DOC,
                text: `${RECORD_HEAD}### ARC-911\ntype: fact\nsubject: a.b\nstatement: One.\nconfidence: inferred\nsource: S1\n`,
            },
        ],
    },
    {
        rule: "record",
        kind: "disputedNotSurfaced",
        fires: [
            {
                path: RECORD_DOC,
                text:
                    `${RECORD_HEAD}### ARC-912\ntype: fact\nsubject: a.b\nstatement: One.\n` +
                    "confidence: community\nstatus: disputed\nsource: S1\n",
            },
        ],
        passes: [
            {
                path: RECORD_DOC,
                text:
                    `${RECORD_HEAD}### ARC-912\ntype: fact\nsubject: a.b\nstatement: One.\n` +
                    "confidence: community\nstatus: disputed\nsee: ARC-916\nsource: S1\n\n" +
                    "### ARC-916\ntype: fact\nsubject: a.c\nstatement: The counterpart that disagrees.\n" +
                    "confidence: community\nsource: S1\n",
            },
        ],
    },
    {
        rule: "record",
        kind: "unknownKind",
        fires: [
            {
                path: RECORD_DOC,
                text:
                    `${RECORD_HEAD}### ARC-913\ntype: tension\nsubject: a.b\nstatement: One.\nconfidence: community\n` +
                    "kind: maybe\nconflicts: ARC-910\nwith: ARC-911\naxis: probe\ncause: probe\nresolution: probe\n" +
                    "remediate: probe\ncompatible: —\nincompatible: —\nsource: S1\n",
            },
        ],
        passes: [
            {
                path: RECORD_DOC,
                text:
                    `${RECORD_HEAD}### ARC-913\ntype: tension\nsubject: a.b\nstatement: One.\nconfidence: community\n` +
                    "kind: real\nconflicts: ARC-910\nwith: ARC-911\naxis: probe\ncause: probe\nresolution: probe\n" +
                    "remediate: probe\ncompatible: —\nincompatible: —\nsource: S1\n",
            },
        ],
    },
    {
        rule: "record",
        kind: "missingTensionKey",
        fires: [
            {
                path: RECORD_DOC,
                text:
                    `${RECORD_HEAD}### ARC-914\ntype: tension\nsubject: a.b\nstatement: One.\nconfidence: community\n` +
                    "kind: real\nconflicts: ARC-910\nwith: ARC-911\naxis: probe\ncause: probe\nsource: S1\n",
            },
        ],
        passes: [
            {
                path: RECORD_DOC,
                text:
                    `${RECORD_HEAD}### ARC-914\ntype: tension\nsubject: a.b\nstatement: One.\nconfidence: community\n` +
                    "kind: real\nconflicts: ARC-910\nwith: ARC-911\naxis: probe\ncause: probe\nresolution: probe\n" +
                    "remediate: probe\ncompatible: —\nincompatible: —\nsource: S1\n",
            },
        ],
    },
    {
        rule: "record",
        kind: "kindContradiction",
        fires: [
            {
                path: RECORD_DOC,
                text:
                    `${RECORD_HEAD}### ARC-915\ntype: tension\nsubject: a.b\nstatement: One.\nconfidence: community\n` +
                    "kind: apparent\nconflicts: ARC-910\nwith: ARC-911\naxis: probe\ncause: probe\nresolution: probe\n" +
                    "remediate: probe\ncompatible: ARC-911\nincompatible: ARC-911\nsource: S1\n",
            },
        ],
        passes: [
            {
                path: RECORD_DOC,
                text:
                    `${RECORD_HEAD}### ARC-915\ntype: tension\nsubject: a.b\nstatement: One.\nconfidence: community\n` +
                    "kind: apparent\nconflicts: ARC-910\nwith: ARC-911\naxis: probe\ncause: probe\nresolution: probe\n" +
                    "remediate: probe\ncompatible: ARC-911\nincompatible: none\nsource: S1\n",
            },
        ],
    },
    {
        rule: "record",
        kind: "unknownDerivation",
        fires: [
            {
                path: inTree("intel/references/base.reference.md"),
                text:
                    `${RECORD_HEAD}### ARC-902\ntype: fact\nsubject: a.b\nstatement: One.\n` +
                    "confidence: community\nderivation: reworded\nsource: S1\n",
            },
        ],
        passes: [
            {
                path: inTree("intel/references/base.reference.md"),
                text:
                    `${RECORD_HEAD}### ARC-902\ntype: fact\nsubject: a.b\nstatement: One.\n` +
                    "confidence: community\nderivation: adapted\nsource: S1\n",
            },
        ],
    },
    {
        rule: "record",
        kind: "duplicateId",
        fires: [
            {
                path: inTree("intel/references/base.reference.md"),
                text:
                    `${RECORD_HEAD}### ARC-900\ntype: fact\nsubject: a.b\nstatement: One.\n` +
                    "confidence: community\nsource: S1\n\n" +
                    "### ARC-900\ntype: fact\nsubject: a.c\nstatement: Two.\nconfidence: community\nsource: S1\n",
            },
        ],
        passes: [
            {
                path: inTree("intel/references/base.reference.md"),
                text:
                    `${RECORD_HEAD}### ARC-900\ntype: fact\nsubject: a.b\nstatement: One.\n` +
                    "confidence: community\nsource: S1\n\n" +
                    "### ARC-901\ntype: fact\nsubject: a.c\nstatement: Two.\nconfidence: community\nsource: S1\n",
            },
        ],
    },
    {
        rule: "template",
        kind: "gateMissing",
        fires: [
            {
                path: CHECKLIST_TEMPLATE,
                text: "tel-priority constrain ver-stop\n",
            },
        ],
        passes: [
            {
                path: CHECKLIST_TEMPLATE,
                text: "tel-priority constrain ver-stop ter-stop\n",
            },
        ],
    },
    {
        rule: "template",
        kind: "participationUndeclared",
        onDisk: true,
        fires: [
            {
                path: `${AGENT_ROOT}probe-agent.md`,
                text: "tel-priority constrain ver-stop ter-stop\n",
            },
        ],
        passes: [
            {
                path: `${AGENT_ROOT}probe.SAa.md`,
                text:
                    "THIS AGENT IS SAa.\n" +
                    "tel-priority constrain ver-stop ter-stop\n",
            },
        ],
    },
    {
        rule: "template",
        kind: "skillDoesNotResolve",
        onDisk: true,
        fires: [PRELOADING_AGENT],
        passes: [PRELOADING_AGENT, { path: `${SKILL_ROOT}collaboration-protocol/SKILL.md`, text: "name: collaboration-protocol\n" }],
    },
    {
        rule: "template",
        kind: "protocolNotPreloaded",
        onDisk: true,
        fires: [
            {
                path: `${AGENT_ROOT}probe.SAa.md`,
                text:
                    "---\nname: probe-SAa\n---\n" +
                    "THIS AGENT IS SAa.\n" +
                    "tel-priority constrain ver-stop ter-stop\n",
            },
        ],
        passes: [
            {
                path: `${AGENT_ROOT}probe.SAa.md`,
                text:
                    "---\nname: probe-SAa\n---\n" +
                    "THIS AGENT IS SAa.\n" +
                    "SKILLS: collaboration-protocol\n" +
                    "tel-priority constrain ver-stop ter-stop\n",
            },
        ],
    },
    {
        rule: "template",
        kind: "undeliveredKey",
        onDisk: true,
        fires: [
            {
                path: `${AGENT_ROOT}probe.SAa.md`,
                text:
                    "---\nname: probe-SAa\nparticipation: SAa\n---\n" +
                    "THIS AGENT IS SAa.\n" +
                    "tel-priority constrain ver-stop ter-stop\n",
            },
        ],
        passes: [
            {
                path: `${AGENT_ROOT}probe.SAa.md`,
                text:
                    "---\nname: probe-SAa\n---\n" +
                    "THIS AGENT IS SAa.\n" +
                    "tel-priority constrain ver-stop ter-stop\n",
            },
        ],
    },
    {
        rule: "binding",
        kind: "stateNotHonoured",
        fires: [
            {
                path: `${TEMPLATE_ROOT}base.protocol.template.md`,
                text: "read `{project.design_guide}` here and act on what it holds\n",
            },
            BINDING_SAMPLE,
        ],
        passes: [
            {
                path: `${TEMPLATE_ROOT}base.protocol.template.md`,
                text: "`{project.design_guide}` resolves ABSENT, so the branch reading it does not run\n",
            },
            BINDING_SAMPLE,
        ],
    },
    {
        rule: "binding",
        kind: "bindingDrift",
        onDisk: true,
        heals: [{ path: BINDING_PATH, text: "a rendered binding that does not match the configuration\n" }],
    },
    {
        rule: "binding",
        kind: "slotInWrongSection",
        fires: [
            { path: `${TEMPLATE_ROOT}base.protocol.template.md`, text: "resolve `{project.axis_document}` here\n" },
        ],
        passes: [
            { path: `${TEMPLATE_ROOT}base.protocol.template.md`, text: "resolve `{surface.axis_document}` here\n" },
        ],
    },
    {
        rule: "binding",
        kind: "unresolvedSlot",
        fires: [
            { path: `${TEMPLATE_ROOT}base.protocol.template.md`, text: "resolve `{project.no_such_slot}` here\n" },
        ],
        passes: [
            { path: `${TEMPLATE_ROOT}base.protocol.template.md`, text: "resolve `{project.root}` here\n" },
        ],
    },
    {
        rule: "checklist",
        kind: "closureBeforeItsDependencies",
        fires: [
            {
                path: inPlanning("base.checklist.md"),
                text: `CLOSES: 1.1.1\n\n${TASK}\n### PHASE \`structure-later\`\n${LATER_TASK}`,
            },
        ],
        passes: [
            {
                path: inPlanning("base.checklist.md"),
                text: `CLOSES: 2.1.1\n\n${TASK}\n### PHASE \`structure-later\`\n${LATER_TASK}`,
            },
        ],
    },
    {
        rule: "coverage",
        kind: "unreachedGate",
        exempt:
            "the firing half needs a CONSUMER DECLARATION rather than tree content: the kind fires only where the " +
            "consumer states that an unreached gate FAILS, and that value is module-level configuration read at load " +
            "rather than a file a seeded tree can vary. This consumer declares that it does not fail, so the kind is " +
            "unfirable here by the consumer's own answer — which is the state the third value exists to express and not " +
            "a gap in the check. It was PROVEN by inverting that declaration and watching it fire on both members of its " +
            "real population, then reverting; what cannot be automated is the inversion, because a fixture that rewrote " +
            "the configuration would be proving the check against a consumer nobody has.",
    },
    {
        rule: "checklist",
        kind: "undeclaredDistribution",
        fires: [{ path: inPlanning("base.checklist.md"), text: TASK }],
        passes: [
            {
                path: inPlanning("base.checklist.md"),
                text: `DISTRIBUTES: probe${BLOCKING_SUFFIX}\n\n${TASK}`,
            },
            { path: inSurface(`probe${BLOCKING_SUFFIX}`), text: "READ AND AWAITING: Z\n\nSUCCESSOR: probe-invariant\n" },
        ],
    },
    {
        rule: "checklist",
        kind: "spentDistribution",
        fires: [
            {
                path: inPlanning("base.checklist.md"),
                text: `DISTRIBUTES: absent-venue${BLOCKING_SUFFIX}\n\n${TASK}`,
            },
        ],
        passes: [
            {
                path: inPlanning("base.checklist.md"),
                text: `DISTRIBUTES: probe${BLOCKING_SUFFIX}\n\n${TASK}`,
            },
            { path: inSurface(`probe${BLOCKING_SUFFIX}`), text: "READ AND AWAITING: Z\n\nSUCCESSOR: probe-invariant\n" },
        ],
    },
    {
        rule: "checklist",
        kind: "history",
        fires: [
            {
                path: inPlanning("base.checklist.md"),
                text: `${TASK}\nThis was done previously.\n`,
            },
        ],
        passes: [{ path: inPlanning("base.checklist.md"), text: TASK }],
    },
    {
        rule: "checklist",
        kind: "literalCount",
        fires: [
            {
                path: RULES_DIGESTS + "probe.rule.md",
                text: "# probe\n\nThe pipeline registers 7 rules over this tree.\n",
            },
        ],
        passes: [
            {
                path: RULES_DIGESTS + "probe.rule.md",
                text: '# probe\n\nA count stated as "7 rules" is the construct being named rather than transcribed.\n',
            },
        ],
    },
    {
        rule: "coverage",
        kind: "ungatedBacklog",
        fires: [
            { path: AXIS_DOCUMENT, text: "- `probe_rule`: a probe · gate: none\n" },
            { path: RULES_DIGESTS + "conduct.rule.md", text: "# conduct\n" },
        ],
        passes: [
            { path: AXIS_DOCUMENT, text: "- `probe_rule`: a probe · gate: verdict\n" },
            { path: RULES_DIGESTS + "conduct.rule.md", text: "# conduct\n" },
            { path: inRules("verdict.rule.ts"), text: 'id: "verdict",\n' },
        ],
    },
    {
        rule: "coverage",
        kind: "digestDeclares",
        onDisk: true,
        fires: [
            { path: AXIS_DOCUMENT, text: "- `probe_rule`: a probe · gate: verdict\n" },
            {
                path: RULES_DIGESTS + "probe.rule.md",
                text: "# probe\n\n- `probe_rule`: a probe · gate: verdict\n",
            },
            { path: inRules("verdict.rule.ts"), text: 'id: "verdict",\n' },
        ],
        passes: [
            { path: AXIS_DOCUMENT, text: "- `probe_rule`: a probe · gate: verdict\n" },
            { path: RULES_DIGESTS + "probe.rule.md", text: "# probe\n\nprose without a declaration\n" },
            { path: inRules("verdict.rule.ts"), text: 'id: "verdict",\n' },
        ],
        heals: [
            { path: AXIS_DOCUMENT, text: "- `probe_rule`: a probe · gate: verdict\n" },
            {
                path: RULES_DIGESTS + "probe.rule.md",
                text: "# probe\n\n- `probe_rule`: a probe · gate: verdict\n",
            },
            { path: inRules("verdict.rule.ts"), text: 'id: "verdict",\n' },
        ],
    },
    {
        rule: "role",
        kind: "roleMissing",
        fires: [
            {
                path: AGENT_INDEX,
                text: "| letter | role | state |\n|---|---|---|\n| Q | Probe seat | ACTIVE |\n",
            },
            ROLE_TEMPLATE_SAMPLE,
        ],
        passes: [
            {
                path: AGENT_INDEX,
                text: "| letter | role | state |\n|---|---|---|\n| Q | Probe seat | ACTIVE |\n",
            },
            ROLE_TEMPLATE_SAMPLE,
            { path: inRoles("probe.q.role.md"), text: `${ROLE_HEAD}# Name\n` },
        ],
    },
    {
        rule: "role",
        kind: "roleSectionMissing",
        fires: [{ path: inRoles("probe.role.md"), text: `${ROLE_HEAD}# Name\n\nD.\n` }],
        passes: [
            {
                path: inRoles("probe.role.md"),
                text: `${ROLE_HEAD}${ROLE_SECTIONS.map((section) => `${section}\n\nstated.\n`).join("\n")}`,
            },
        ],
    },
    {
        rule: "role",
        kind: "measuredSectionUnfilled",
        fires: [
            {
                path: inRoles("probe.role.md"),
                text: `${ROLE_HEAD}${ROLE_SECTIONS.map((section) => `${section}\n\nstated.\n`).join("\n")}\n${ROLE_SUBSECTIONS.map((section) => `${section}\n\n<the seed line, which states nothing>\n`).join("\n")}`,
            },
        ],
        passes: [
            {
                path: inRoles("probe.role.md"),
                text: `${ROLE_HEAD}${ROLE_SECTIONS.map((section) => `${section}\n\nstated.\n`).join("\n")}\n${ROLE_SUBSECTIONS.map((section) => `${section}\n\na measured shape with its tell.\n`).join("\n")}`,
            },
        ],
    },
    {
        rule: "board",
        kind: "unstampedItem",
        fires: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            BOARD_TEMPLATE_SAMPLE,
            AGENT_INDEX_SAMPLE,
            {
                path: BOARD,
                text: `┌─── AGENT D ───\nAgent D — ACTIVE\n  Owns:    probe\n  Status:  probe\n  Blocked: —\n  Flags:   —\n           ┌─── AGENT D-1 ─── to:A\n           hand-opened, so the sweep can never key it\n           └─── END AGENT D-1\n  Refs:    —\n└─── END AGENT D\n`,
            },
        ],
        passes: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            BOARD_TEMPLATE_SAMPLE,
            AGENT_INDEX_SAMPLE,
            {
                path: BOARD,
                text: `┌─── AGENT D ───\nAgent D — ACTIVE\n  Owns:    probe\n  Status:  probe\n  Blocked: —\n  Flags:   —\n           ┌─── AGENT D-1 ─── at:1700000000000 to:A\n           tool-opened, so the sweep can key it\n           └─── END AGENT D-1\n  Refs:    —\n└─── END AGENT D\n`,
            },
        ],
    },
    {
        rule: "board",
        kind: "foreignItemLetter",
        fires: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            BOARD_TEMPLATE_SAMPLE,
            AGENT_INDEX_SAMPLE,
            {
                path: BOARD,
                text: `┌─── AGENT D ───\nAgent D — ACTIVE\n  Owns:    probe\n  Status:  probe\n  Blocked: —\n  Flags:   —\n           ┌─── AGENT E-1 ─── at:1700000000000 to:A\n           a well-formed item whose key names a seat other than the record holding it\n           └─── END AGENT E-1\n  Refs:    —\n└─── END AGENT D\n`,
            },
        ],
        passes: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            BOARD_TEMPLATE_SAMPLE,
            AGENT_INDEX_SAMPLE,
            {
                path: BOARD,
                text: `┌─── AGENT D ───\nAgent D — ACTIVE\n  Owns:    probe\n  Status:  probe\n  Blocked: —\n  Flags:   —\n           ┌─── AGENT D-1 ─── at:1700000000000 to:A\n           the key letter and the record holding it agree\n           └─── END AGENT D-1\n  Refs:    —\n└─── END AGENT D\n`,
            },
        ],
    },
    {
        rule: "board",
        kind: "missingField",
        fires: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            {
                path: BOARD,
                text: `┌─── AGENT D ───\nAgent D — ACTIVE\n  Owns:    probe\n  Status:  probe\n  Blocked: —\n  Refs:    —\n└─── END AGENT D\n`,
            },
        ],
        passes: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            { path: BOARD, text: FULL_RECORD },
        ],
    },
    {
        rule: "board",
        kind: "extraField",
        fires: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            {
                path: BOARD,
                text: `┌─── AGENT D ───\nAgent D — ACTIVE\n  Owns:    probe\n  Status:  probe\n  Blocked: —\n  Flags:   —\n  Refs:    —\n  Notes:   prose that belongs behind a ref\n└─── END AGENT D\n`,
            },
        ],
        passes: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            { path: BOARD, text: FULL_RECORD },
        ],
    },
    {
        rule: "board",
        kind: "badState",
        fires: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            {
                path: BOARD,
                text: `${FULL_RECORD}\n┌─── GATE probe ───\nGate probe — probe\n  State:   ALMOST\n  Owner:   D\n  Blocker: —\n└─── END GATE probe\n`,
            },
        ],
        passes: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            {
                path: BOARD,
                text: `${FULL_RECORD}\n┌─── GATE probe ───\nGate probe — probe\n  State:   PENDING\n  Owner:   D\n  Blocker: —\n└─── END GATE probe\n`,
            },
        ],
    },
    {
        rule: "board",
        kind: "repeatedClaim",
        fires: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            {
                path: BOARD,
                text: `┌─── AGENT D ───\nAgent D — ACTIVE\n  Owns:    ${REPEATED}\n  Status:  probe\n  Blocked: —\n  Flags:   —\n  Refs:    —\n└─── END AGENT D\n`,
            },
        ],
        passes: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            { path: BOARD, text: FULL_RECORD },
        ],
    },
    {
        rule: "board",
        kind: "selfAnswer",
        fires: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            {
                path: BOARD,
                text: `┌─── AGENT D ───\nAgent D — ACTIVE\n  Owns:    probe\n  Status:  probe\n  Blocked: —\n  Flags:   —\n  Refs:    —\n  Answer-D: the seat answers itself\n└─── END AGENT D\n`,
            },
        ],
        passes: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            { path: BOARD, text: FULL_RECORD },
        ],
    },
    {
        rule: "board",
        kind: "danglingAnswer",
        fires: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            {
                path: BOARD,
                text: `┌─── AGENT D ───\nAgent D — ACTIVE\n  Owns:    probe\n  Status:  probe\n  Blocked: —\n  Flags:   —\n  Refs:    —\n  Answer-Z: addressed to a seat the board does not declare\n└─── END AGENT D\n`,
            },
        ],
        passes: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            { path: BOARD, text: FULL_RECORD },
        ],
    },
    {
        rule: "board",
        kind: "danglingAnswer",
        fires: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            {
                path: AGENT_INDEX,
                text: "| letter | role | state |\n|---|---|---|\n| D | Probe seat | INACTIVE |\n| E | Probe seat | ACTIVE |\n",
            },
            {
                path: BOARD,
                text:
                    "┌─── AGENT D ───\nAgent D — INACTIVE\n  Owns:    probe\n  Status:  probe\n  Blocked: —\n  Flags:   —\n  Refs:    —\n└─── END AGENT D\n" +
                    "┌─── AGENT E ───\nAgent E — ACTIVE\n  Owns:    probe\n  Status:  probe\n  Blocked: —\n  Flags:   —\n  Refs:    —\n  Answer-D: addressed to a seat the board no longer declares active\n└─── END AGENT E\n",
            },
        ],
        passes: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            {
                path: AGENT_INDEX,
                text: "| letter | role | state |\n|---|---|---|\n| D | Probe seat | ACTIVE |\n| E | Probe seat | ACTIVE |\n",
            },
            {
                path: BOARD,
                text:
                    "┌─── AGENT D ───\nAgent D — ACTIVE\n  Owns:    probe\n  Status:  probe\n  Blocked: —\n  Flags:   —\n  Refs:    —\n└─── END AGENT D\n" +
                    "┌─── AGENT E ───\nAgent E — ACTIVE\n  Owns:    probe\n  Status:  probe\n  Blocked: —\n  Flags:   —\n  Refs:    —\n  Answer-D: addressed to a seat the board declares active\n└─── END AGENT E\n",
            },
        ],
    },
    {
        rule: "board",
        kind: "duplicateIndexBinding",
        fires: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            { path: BOARD, text: FULL_RECORD },
            { path: AGENT_INDEX, text: "| D | one role | ACTIVE |\n| D | a second binding | ACTIVE |\n" },
        ],
        passes: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            { path: BOARD, text: FULL_RECORD },
            { path: AGENT_INDEX, text: "| D | one role | ACTIVE |\n" },
        ],
    },
    projectionFixture("staleProjection", "the document carries no projection line at all\n"),
    projectionFixture("falseProjection", "collab-status: current\n", [
        { path: inSurface("identity.blocking.md"), text: "open venue\n" },
    ]),
    projectionFixture("oversizedProjection", `collab-status: ${"x".repeat(PROJECTION_CAP_CHARS + 1)}\n`),
    {
        rule: "board",
        kind: "staleGateState",
        onDisk: true,
        fires: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            {
                path: inGenerated("probe.report.generated.json"),
                text: '{"tool":"probe","verdict":"fail","authoritative":true,"bypassed":false}\n',
            },
            {
                path: BOARD,
                text:
                    "┌─── AGENT D ───\nAgent D — ACTIVE\n└─── END AGENT D\n\n" +
                    "Gate — probe\n  State:   PASS\n  Owner:   —\n  Blocker: —\n",
            },
        ],
        passes: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            {
                path: inGenerated("probe.report.generated.json"),
                text: '{"tool":"probe","verdict":"fail","authoritative":true,"bypassed":false}\n',
            },
            {
                path: BOARD,
                text:
                    "┌─── AGENT D ───\nAgent D — ACTIVE\n└─── END AGENT D\n\n" +
                    "Gate — probe\n  State:   RED\n  Owner:   —\n  Blocker: —\n",
            },
        ],
    },
    {
        rule: "board",
        kind: "phantomProjection",
        ...(PROJECTION_HOST_ABSENT
            ? { exempt: PROJECTION_EXEMPT }
            : {
                  fires: [
                      {
                          path: HOST_DOCUMENT,
                          text: "collab-status: ONE BLOCKER — `spine.blocking.md` outranks every queue\n",
                      },
                      { path: BOARD, text: FULL_RECORD },
                  ],
                  passes: [
                      { path: HOST_DOCUMENT, text: "collab-status: NO BLOCKER · read the board\n" },
                      { path: BOARD, text: FULL_RECORD },
                  ],
              }),
    },
    {
        rule: "board",
        kind: "undelimitedRecord",
        fires: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            { path: BOARD, text: "Agent D — ACTIVE\n  Owns:    x\n" },
        ],
        passes: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            {
                path: BOARD,
                text: "┌─── AGENT D ───\nAgent D — ACTIVE\n  Owns:    x\n└─── END AGENT D\n",
            },
        ],
    },
    {
        rule: "board",
        kind: "staleMarker",
        fires: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            { path: AGENT_INDEX, text: "| letter | role | state |\n| D | Enforcement | ACTIVE |\n" },
            {
                path: BOARD,
                text:
                    "┌─── AGENT D ───\nAgent D — ACTIVE\n  Owns:    x\n  Status:  DONE\n  Blocked: —\n" +
                    "  Flags:   —\n  Refs:    —\n└─── END AGENT D\n",
            },
        ],
        passes: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            { path: AGENT_INDEX, text: "| letter | role | state |\n| D | Enforcement | ACTIVE |\n" },
            {
                path: BOARD,
                text:
                    "┌─── AGENT D ───\nAgent D — ACTIVE\n  Owns:    x\n  Status:  the extraction is DONE\n" +
                    "  Blocked: —\n  Flags:   —\n  Refs:    —\n└─── END AGENT D\n",
            },
        ],
    },
    {
        rule: "board",
        kind: "templateDrift",
        fires: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            { path: AGENT_INDEX, text: "| letter | role | state |\n| D | Enforcement | ACTIVE |\n" },
            {
                path: BOARD_TEMPLATE,
                text: `Agent <letter> — <ACTIVE>\n${AGENT_FIELDS.slice(0, -1)
                    .map((field) => `  ${field}: <v>`)
                    .join("\n")}\n`,
            },
            { path: BOARD, text: "" },
        ],
        passes: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            { path: AGENT_INDEX, text: "| letter | role | state |\n| D | Enforcement | ACTIVE |\n" },
            {
                path: BOARD_TEMPLATE,
                text: `Agent <letter> — <ACTIVE>\n${AGENT_FIELDS.map((field) => `  ${field}: <v>`).join("\n")}\n`,
            },
            { path: BOARD, text: "" },
        ],
    },
    {
        rule: "board",
        kind: "unindexedAgent",
        fires: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            { path: AGENT_INDEX, text: "| letter | role | state |\n| D | Enforcement | ACTIVE |\n" },
            {
                path: BOARD,
                text:
                    "┌─── AGENT Q ───\nAgent Q — ACTIVE\n  Owns:    x\n  Status:  —\n  Blocked: —\n" +
                    "  Flags:   —\n  Refs:    —\n└─── END AGENT Q\n",
            },
        ],
        passes: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            { path: AGENT_INDEX, text: "| letter | role | state |\n| D | Enforcement | ACTIVE |\n" },
            {
                path: BOARD,
                text:
                    "┌─── AGENT D ───\nAgent D — ACTIVE\n  Owns:    x\n  Status:  —\n  Blocked: —\n" +
                    "  Flags:   —\n  Refs:    —\n└─── END AGENT D\n",
            },
        ],
    },
    {
        rule: "declaration",
        kind: "unreadAssertedAxis",
        fires: [
            {
                path: `${surfacePath("pipeline")}/core/validators/probe.axis.ts`,
                text: "export function contentIsFrozen(target: string): boolean {\n    const declared = lifetimeOf(target);\n    return declared !== null && declared.retention === \"accumulating\" && declared.removal === \"none\";\n}\n",
            },
        ],
        passes: [
            {
                path: `${surfacePath("pipeline")}/core/validators/probe.axis.ts`,
                text: "export function contentIsFrozen(target: string): boolean {\n    const declared = lifetimeOf(target);\n    return declared !== null && declared.mutability === \"frozen\";\n}\n",
            },
        ],
    },
    {
        rule: "board",
        kind: "derivedStateDrift",
        fires: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            { path: AGENT_INDEX, text: "| letter | role | state |\n| D | Enforcement | STOPPED |\n" },
            {
                path: BOARD,
                text:
                    "┌─── AGENT D ───\nAgent D — ACTIVE\n  Owns:    x\n  Status:  —\n  Blocked: —\n" +
                    "  Flags:   —\n  Refs:    —\n└─── END AGENT D\n",
            },
        ],
        passes: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            { path: AGENT_INDEX, text: "| letter | role | state |\n| D | Enforcement | ACTIVE |\n" },
            {
                path: BOARD,
                text:
                    "┌─── AGENT D ───\nAgent D — ACTIVE\n  Owns:    x\n  Status:  —\n  Blocked: —\n" +
                    "  Flags:   —\n  Refs:    —\n└─── END AGENT D\n",
            },
        ],
        heals: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            { path: AGENT_INDEX, text: "| letter | role | state |\n| D | Enforcement | STOPPED |\n" },
            {
                path: BOARD,
                text:
                    "┌─── AGENT D ───\nAgent D — ACTIVE\n  Owns:    x\n  Status:  —\n  Blocked: —\n" +
                    "  Flags:   —\n  Refs:    —\n└─── END AGENT D\n",
            },
        ],
    },
    {
        rule: "board",
        kind: "danglingAddressee",
        fires: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            {
                path: BOARD,
                text:
                    "┌─── AGENT D ───\nAgent D — ACTIVE\n  Owns:    x\n  Status:  —\n  Blocked: —\n" +
                    "  Flags:   —\n           To Q — a thing\n  Refs:    —\n└─── END AGENT D\n",
            },
        ],
        passes: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            {
                path: AGENT_INDEX,
                text: "| letter | role | state |\n|---|---|---|\n| D | Probe seat | ACTIVE |\n",
            },
            {
                path: BOARD,
                text:
                    "┌─── AGENT D ───\nAgent D — ACTIVE\n  Owns:    x\n  Status:  —\n  Blocked: —\n" +
                    "  Flags:   —\n           To D — a thing\n  Refs:    —\n└─── END AGENT D\n",
            },
        ],
    },
    {
        rule: "board",
        kind: "malformedItemFence",
        fires: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            {
                path: BOARD,
                text:
                    "┌─── AGENT D ───\nAgent D — ACTIVE\n  Owns:    x\n  Status:  —\n  Blocked: —\n" +
                    "  Flags:   —\n           To C — a thing\n           └─── END AGENT D-1\n" +
                    "  Refs:    —\n└─── END AGENT D\n",
            },
        ],
        passes: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            {
                path: BOARD,
                text:
                    "┌─── AGENT D ───\nAgent D — ACTIVE\n  Owns:    x\n  Status:  —\n  Blocked: —\n" +
                    "  Flags:   —\n           ┌─── AGENT D-1 ───\n           To C — a thing\n" +
                    "           └─── END AGENT D-1\n  Refs:    —\n└─── END AGENT D\n",
            },
        ],
    },
    {
        rule: "board",
        kind: "unresolvedAddressing",
        fires: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            {
                path: BOARD,
                text:
                    "┌─── AGENT D ───\nAgent D — ACTIVE\n  Owns:    x\n  Status:  —\n  Blocked: —\n" +
                    "  Flags:   —\n           ┌─── AGENT D-1 ─── at:1 to:*\n           To C — a thing\n" +
                    "           └─── END AGENT D-1\n  Refs:    —\n└─── END AGENT D\n",
            },
        ],
        passes: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            {
                path: BOARD,
                text:
                    "┌─── AGENT D ───\nAgent D — ACTIVE\n  Owns:    x\n  Status:  —\n  Blocked: —\n" +
                    "  Flags:   —\n           ┌─── AGENT D-1 ─── at:1 to:C\n           To C — a thing\n" +
                    "           └─── END AGENT D-1\n  Refs:    —\n└─── END AGENT D\n",
            },
        ],
    },
    {
        rule: "board",
        kind: "duplicateField",
        fires: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            {
                path: BOARD,
                text:
                    "┌─── AGENT D ───\nAgent D — ACTIVE\n  Owns:    x\n  Status:  —\n  Blocked: —\n" +
                    "  Flags:   a\n  Flags:   b\n  Refs:    —\n└─── END AGENT D\n",
            },
        ],
        passes: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            {
                path: BOARD,
                text:
                    "┌─── AGENT D ───\nAgent D — ACTIVE\n  Owns:    x\n  Status:  —\n  Blocked: —\n" +
                    "  Flags:   a\n  Refs:    —\n└─── END AGENT D\n",
            },
        ],
    },
    {
        rule: "board",
        kind: "interleavedRecord",
        fires: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            {
                path: BOARD,
                text:
                    "┌─── AGENT B ───\nAgent B — ACTIVE\n  Owns:    x\n" +
                    "┌─── AGENT C ───\nAgent C — ACTIVE\n  Owns:    y\n" +
                    "└─── END AGENT C\n└─── END AGENT B\n",
            },
        ],
        passes: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            {
                path: BOARD,
                text:
                    "┌─── AGENT B ───\nAgent B — ACTIVE\n  Owns:    x\n└─── END AGENT B\n" +
                    "┌─── AGENT C ───\nAgent C — ACTIVE\n  Owns:    y\n└─── END AGENT C\n",
            },
        ],
    },
    {
        rule: "board",
        kind: "unreadableField",
        fires: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            {
                path: BOARD,
                text: `┌─── AGENT D ───\nAgent D — ACTIVE\n  Owns:    ${"x".repeat(50001)}\n└─── END AGENT D\n`,
            },
        ],
        passes: [
            { path: HOST_DOCUMENT, text: "collab-status: current\n" },
            {
                path: BOARD,
                text: "┌─── AGENT D ───\nAgent D — ACTIVE\n  Owns:    x\n└─── END AGENT D\n",
            },
        ],
    },
    {
        rule: "template",
        kind: "participationUnindexed",
        onDisk: true,
        fires: [
            { path: `${AGENT_ROOT}probe.SAz.md`, text: agentBody("SAz") },
            { path: AGENT_INDEX, text: INDEXED_PROBE_LETTER },
        ],
        passes: [
            { path: `${AGENT_ROOT}probe.SAa.md`, text: PRELOADING_AGENT.text },
            { path: AGENT_INDEX, text: INDEXED_PROBE_LETTER },
        ],
    },
    {
        rule: "template",
        kind: "letterNotInName",
        onDisk: true,
        fires: [
            { path: `${AGENT_ROOT}probe.md`, text: PRELOADING_AGENT.text },
            { path: AGENT_INDEX, text: INDEXED_PROBE_LETTER },
        ],
        passes: [
            { path: `${AGENT_ROOT}probe.SAa.md`, text: PRELOADING_AGENT.text },
            { path: AGENT_INDEX, text: INDEXED_PROBE_LETTER },
        ],
    },
    {
        rule: "template",
        kind: "templateImported",
        fires: [
            { path: CHECKLIST_TEMPLATE, text: `${EXECUTED_HEAD}see ${AGENT_TEMPLATE_BASENAME} for the spine\n` },
            { path: `${TEMPLATE_ROOT}${AGENT_TEMPLATE_BASENAME}`, text: EXECUTED_HEAD },
        ],
        passes: [
            { path: CHECKLIST_TEMPLATE, text: `${EXECUTED_HEAD}this template inlines its whole structure\n` },
            { path: `${TEMPLATE_ROOT}${AGENT_TEMPLATE_BASENAME}`, text: EXECUTED_HEAD },
        ],
    },
    {
        rule: "coverage",
        kind: "undeclaredExpansion",
        onDisk: true,
        fires: [
            { path: AXIS_DOCUMENT, text: slugLine("probe_slug", "probe") },
            { path: CONDUCT_REGISTRY_PATH, text: CLEAN_REGISTRY },
            { path: `${RULES_DIGESTS}probe.rule.md`, text: "## `a_slug_no_axis_document_declares`\n\nthe expansion\n" },
            REGISTERED_PROBE_GATE,
        ],
        passes: [
            { path: AXIS_DOCUMENT, text: slugLine("probe_slug", "probe") },
            { path: CONDUCT_REGISTRY_PATH, text: CLEAN_REGISTRY },
            { path: `${RULES_DIGESTS}probe.rule.md`, text: "## `probe_slug`\n\nthe expansion\n" },
            REGISTERED_PROBE_GATE,
        ],
    },
    {
        rule: "coverage",
        kind: "duplicateSlug",
        fires: [
            { path: AXIS_DOCUMENT, text: `${slugLine("probe_slug", "probe")}${slugLine("probe_slug", "probe")}` },
            { path: CONDUCT_REGISTRY_PATH, text: CLEAN_REGISTRY },
            REGISTERED_PROBE_GATE,
        ],
        passes: [
            { path: AXIS_DOCUMENT, text: slugLine("probe_slug", "probe") },
            { path: CONDUCT_REGISTRY_PATH, text: CLEAN_REGISTRY },
            REGISTERED_PROBE_GATE,
        ],
    },
    {
        rule: "coverage",
        kind: "unknownGate",
        fires: [
            { path: AXIS_DOCUMENT, text: slugLine("probe_slug", "nosuchgate") },
            { path: CONDUCT_REGISTRY_PATH, text: CLEAN_REGISTRY },
        ],
        passes: [
            { path: AXIS_DOCUMENT, text: slugLine("probe_slug", "probe") },
            { path: CONDUCT_REGISTRY_PATH, text: CLEAN_REGISTRY },
            REGISTERED_PROBE_GATE,
        ],
    },
    {
        rule: "coverage",
        kind: "unprovenConduct",
        fires: [
            { path: AXIS_DOCUMENT, text: slugLine("probe_slug", "conduct") },
            { path: CONDUCT_REGISTRY_PATH, text: CLEAN_REGISTRY },
        ],
        passes: [
            { path: AXIS_DOCUMENT, text: slugLine("probe_slug", "conduct") },
            { path: CONDUCT_REGISTRY_PATH, text: `${CLEAN_REGISTRY}| \`probe_slug\` | nothing observes it | \`—\` |\n` },
        ],
    },
    {
        rule: "coverage",
        kind: "unbuiltCheckableHalf",
        fires: [
            { path: AXIS_DOCUMENT, text: slugLine("probe_slug", "conduct") },
            { path: CONDUCT_REGISTRY_PATH, text: `${CLEAN_REGISTRY}| \`probe_slug\` | a decidable half | \`none\` |\n` },
        ],
        passes: [
            { path: AXIS_DOCUMENT, text: slugLine("probe_slug", "conduct") },
            { path: CONDUCT_REGISTRY_PATH, text: `${CLEAN_REGISTRY}| \`probe_slug\` | nothing observes it | \`—\` |\n` },
        ],
    },
    {
        rule: "blocking",
        kind: "templateAbsent",
        onDisk: true,
        fires: [{ path: inSurface("probe.blocking.md"), text: VENUE_BODY }],
        passes: [
            { path: inSurface("probe.blocking.md"), text: VENUE_BODY },
            { path: VENUE_TEMPLATE_PATH, text: VENUE_TEMPLATE_SOURCE },
        ],
    },
    {
        rule: "role",
        kind: "roleFieldMissing",
        fires: [
            {
                path: inRoles("probe.role.md"),
                text: ROLE_SECTIONS.map((section) => `${section}\n\nstated.\n`).join("\n"),
            },
        ],
        passes: [
            {
                path: inRoles("probe.role.md"),
                text: `${ROLE_HEAD}${ROLE_SECTIONS.map((section) => `${section}\n\nstated.\n`).join("\n")}`,
            },
        ],
    },
    {
        rule: "blocking",
        kind: "unresolvedDiscussion",
        fires: [
            { path: inSurface("probe.blocking.md"), text: VENUE_BODY },
            { path: VENUE_TEMPLATE_PATH, text: VENUE_TEMPLATE_SOURCE },
        ],
        passes: [
            { path: inSurface(`${VENUE_ARCHIVE_TAIL}/probe.blocking.md`), text: VENUE_BODY },
            { path: VENUE_TEMPLATE_PATH, text: VENUE_TEMPLATE_SOURCE },
        ],
    },
    {
        rule: "blocking",
        kind: "positionsBeforeRoster",
        fires: [
            {
                path: inSurface("probe.blocking.md"),
                text: `${VENUE_BODY}\nNOT-READ:        B\nREAD AND AWAITING: A\n\nPosition A1 — a claim landing while a seat has not opened the venue\n`,
            },
        ],
        passes: [
            {
                path: inSurface("probe.blocking.md"),
                text: `${VENUE_BODY}\nNOT-READ:        —\nREAD AND AWAITING: A B\n\nPosition A1 — a claim landing once every seat has opened the venue\n`,
            },
        ],
    },
    {
        rule: "blocking",
        kind: "rosterContradiction",
        fires: [
            {
                path: inSurface("probe.blocking.md"),
                text: `${VENUE_BODY}\nNOT-READ:        A\nREAD AND AWAITING: —\n\nPosition A1 — a claim held by a seat the roster marks unread\n`,
            },
        ],
        passes: [
            {
                path: inSurface("probe.blocking.md"),
                text: `${VENUE_BODY}\nNOT-READ:        —\nREAD AND AWAITING: A\n\nPosition A1 — a claim held by a seat the roster marks read\n`,
            },
        ],
    },
    {
        rule: "blocking",
        kind: "disorderedScheduleRow",
        onDisk: true,
        fires: [
            {
                path: surfacePath("agenda"),
                text:
                    "| planned | invariant | what it must establish | state |\n|---|---|---|---|\n" +
                    "| 1 | `a-first` | x | planned |\n| 2 | `a-second` | x | planned |\n| 1 | `a-third` | x | planned |\n",
            },
        ],
        passes: [
            {
                path: surfacePath("agenda"),
                text:
                    "| planned | invariant | what it must establish | state |\n|---|---|---|---|\n" +
                    "| 1 | `a-first` | x | planned |\n| 2a | `an-inserted` | x | planned |\n| 6 | `a-sixth` | x | planned |\n",
            },
        ],
    },
    {
        rule: "blocking",
        kind: "handPlacedPosition",
        fires: [
            {
                path: inSurface("probe.blocking.md"),
                text: `${VENUE_BODY}\nPosition A1 — a claim placed by hand outside every record\n`,
            },
        ],
        passes: [{ path: inSurface("probe.blocking.md"), text: VENUE_BODY }],
    },
    {
        rule: "blocking",
        kind: "ungatedDecision",
        fires: [
            {
                path: inSurface("probe.blocking.md"),
                text: "# Probe\n\n## Exit condition\n\nDeleted on converge.\n\n| # | decision | gate |\n|---|---|---|\n| P-1 | a thing | |\n",
            },
        ],
        passes: [
            {
                path: inSurface("probe.blocking.md"),
                text: "# Probe\n\n## Exit condition\n\nDeleted on converge.\n\n| # | decision | gate |\n|---|---|---|\n| P-1 | a thing | — |\n",
            },
        ],
    },
    {
        rule: "blocking",
        kind: "venueSchemaDrift",
        fires: [
            {
                path: inSurface("probe.blocking.md"),
                text:
                    "# Probe\n\n## Exit condition\n\nDeleted on converge.\n\n" +
                    "┌─── AGENT A ───\nAgent A — ACTIVE\n  Reading: a\n  Stance:  a\n  Durable: a\n  Positions: a\n└─── END AGENT A\n",
            },
        ],
        passes: [
            {
                path: inSurface("probe.blocking.md"),
                text:
                    "# Probe\n\n## Exit condition\n\nDeleted on converge.\n\n" +
                    "┌─── AGENT A ───\nAgent A — ACTIVE\n  Reading: a\n  Stance:  a\n  Needs:   a\n  Durable: a\n  Positions: a\n└─── END AGENT A\n",
            },
        ],
    },
    {
        rule: "accumulator",
        kind: "unledEntry",
        fires: [
            {
                path: ACCUMULATOR,
                text:
                    "Header. A class entry states what it does NOT cover, under the lead `BOUNDARY:`.\n" +
                    "It states its members under the lead `POPULATION:`.\n\n" +
                    "ENTRIES\n\n### a-probe-class-carrying-one-lead\n\nA body.\n\nBOUNDARY: —\n",
            },
        ],
        passes: [
            {
                path: ACCUMULATOR,
                text:
                    "Header. A class entry states what it does NOT cover, under the lead `BOUNDARY:`.\n" +
                    "It states its members under the lead `POPULATION:`.\n\n" +
                    "ENTRIES\n\n### a-probe-class-carrying-one-lead\n\nA body.\n\nBOUNDARY: —\n\nPOPULATION: —\n",
            },
        ],
    },
    {
        rule: "accumulator",
        kind: "unledEntry",
        fires: [
            {
                path: ACCUMULATOR,
                text:
                    "Header. A class entry states what it does NOT cover, under the lead `BOUNDARY:`.\n" +
                    "It states its members under the lead `POPULATION:`.\n" +
                    "The leads that presuppose a CLASS, and so do not bind an INSTANCES entry: `POPULATION:`\n\n" +
                    "ENTRIES\n\n### a-probe-instances-entry\n\nThis entry carries INSTANCES rather than an invariant.\n",
            },
        ],
        passes: [
            {
                path: ACCUMULATOR,
                text:
                    "Header. A class entry states what it does NOT cover, under the lead `BOUNDARY:`.\n" +
                    "It states its members under the lead `POPULATION:`.\n" +
                    "The leads that presuppose a CLASS, and so do not bind an INSTANCES entry: `POPULATION:`\n\n" +
                    "ENTRIES\n\n### a-probe-instances-entry\n\nThis entry carries INSTANCES rather than an invariant.\n\nBOUNDARY: —\n",
            },
        ],
    },
    {
        rule: "blocking",
        kind: "concurrentVenues",
        fires: [
            {
                path: inSurface("probe.blocking.md"),
                text: "# Probe\n\nNOT-READ:        —\nREAD AND AWAITING: A\n\n## Exit condition\n\nDeleted on converge.\n",
            },
            {
                path: inSurface("second.blocking.md"),
                text: "# Second\n\nNOT-READ:        —\nREAD AND AWAITING: A\n\n## Exit condition\n\nDeleted on converge.\n",
            },
        ],
        passes: [
            {
                path: inSurface("probe.blocking.md"),
                text: "# Probe\n\nNOT-READ:        —\nREAD AND AWAITING: A\n\n## Exit condition\n\nDeleted on converge.\n",
            },
            {
                path: inSurface("second.blocking.md"),
                text: "# Second\n\nNOT-READ:        A B C D\nREAD AND AWAITING:\n\n## Exit condition\n\nDeleted on converge.\n",
            },
        ],
    },
    {
        rule: "blocking",
        kind: "duplicateDistribution",
        onDisk: true,
        fires: [
            {
                path: inSurface("probe.blocking.md"),
                text: "# Probe\n\nNOT-READ:        A B C D\nREAD AND AWAITING:\n\n## Exit condition\n\nDeleted on converge.\n",
            },
            {
                path: inPlanning("first.checklist.md"),
                text: "# First\n\nDISTRIBUTES: probe.blocking.md\nCLOSES: 1.1.1\n",
            },
            {
                path: inPlanning("second.checklist.md"),
                text: "# Second\n\nDISTRIBUTES: probe.blocking.md\nCLOSES: 2.1.1\n",
            },
            { path: VENUE_TEMPLATE_PATH, text: VENUE_TEMPLATE_SOURCE },
        ],
        passes: [
            {
                path: inSurface("probe.blocking.md"),
                text: "# Probe\n\nNOT-READ:        A B C D\nREAD AND AWAITING:\n\n## Exit condition\n\nDeleted on converge.\n",
            },
            {
                path: inPlanning("first.checklist.md"),
                text: "# First\n\nDISTRIBUTES: probe.blocking.md\nCLOSES: 1.1.1\n",
            },
            {
                path: inPlanning("second.checklist.md"),
                text: "# Second\n\nDISTRIBUTES: other.blocking.md\nCLOSES: 2.1.1\n",
            },
            { path: VENUE_TEMPLATE_PATH, text: VENUE_TEMPLATE_SOURCE },
        ],
    },
    {
        rule: "blocking",
        kind: "strandedDeferral",
        fires: [
            {
                path: inSurface("probe.blocking.md"),
                text:
                    "# Probe\n\n## Exit condition\n\nDeleted on converge.\n\n" +
                    "## DEFERRED\n\n- a-clause-nobody-holds → Z\n",
            },
            { path: BOARD, text: FULL_RECORD },
        ],
        passes: [
            {
                path: inSurface("probe.blocking.md"),
                text:
                    "# Probe\n\n## Exit condition\n\nDeleted on converge.\n\n" +
                    "## DEFERRED\n\n- a-clause-a-seat-holds → D\n",
            },
            { path: BOARD, text: FULL_RECORD },
        ],
    },
    {
        rule: "blocking",
        kind: "unrecordedSuccessor",
        fires: [
            {
                path: inSurface("probe.blocking.md"),
                text: "# Probe\n\n## Exit condition\n\nDeleted on converge.\n\nSUCCESSOR: a-subject-the-agenda-never-planned\n",
            },
            { path: AGENDA, text: "| 1 | `a-planned-subject` | what it must establish | planned |\n" },
        ],
        passes: [
            {
                path: inSurface("probe.blocking.md"),
                text: "# Probe\n\n## Exit condition\n\nDeleted on converge.\n\nSUCCESSOR: a-planned-subject\n",
            },
            { path: AGENDA, text: "| 1 | `a-planned-subject` | what it must establish | planned |\n" },
        ],
    },
    {
        rule: "blocking",
        kind: "noExitCondition",
        fires: [{ path: inSurface("probe.blocking.md"), text: "# Probe\n\nA discussion with no stated exit.\n" }],
        passes: [{ path: inSurface("probe.blocking.md"), text: "# Probe\n\n## Exit condition\n\nDeleted when it converges.\n" }],
    },
    {
        rule: "checklist",
        kind: "notAChecklist",
        fires: [{ path: inPlanning("base.checklist.md"), text: "Prose about the work, carrying no task and no phase.\n" }],
        passes: [
            { path: inPlanning("base.checklist.md"), text: TASK },
            {
                path: inPlanning("spent.checklist.md"),
                text: "RETIRED: this surface distributed a venue that has since converged, so it carries no row and stays at its path.\n",
            },
        ],
    },
    {
        rule: "checklist",
        kind: "gateUnnamed",
        fires: [{ path: inPlanning("base.checklist.md"), text: TASK }],
        passes: [
            {
                path: inPlanning("base.checklist.md"),
                text: `${TASK}\n${MANDATORY_GATES.map((gate) => `${gate}: resolved\n`).join("")}`,
            },
        ],
    },
    {
        rule: "checklist",
        kind: "precheckedGate",
        fires: [{ path: inPlanning("base.checklist.md"), text: `${TASK}- [x] 1.1.2 an execution gate.\n` }],
        passes: [{ path: inPlanning("base.checklist.md"), text: `${TASK}- [ ] 1.1.2 an execution gate.\n` }],
    },
    {
        rule: "checklist",
        kind: "contractIncomplete",
        fires: [
            {
                path: inPlanning("base.checklist.md"),
                text: `${TASK}- [ ] 1.1.2 DO it too. *file:* x · *evidence:* y · *owner:* A · *verifier:* A\n`,
            },
        ],
        passes: [
            {
                path: inPlanning("base.checklist.md"),
                text: `${TASK}- [ ] 1.1.2 DO it too. ${ROW_FIELDS}\n`,
            },
        ],
    },
    {
        rule: "checklist",
        kind: "phaseWithoutTask",
        fires: [{ path: inPlanning("base.checklist.md"), text: `${TASK}### PHASE \`structure-empty\`\n\nprose.\n` }],
        passes: [{ path: inPlanning("base.checklist.md"), text: TASK }],
    },
    {
        rule: "checklist",
        kind: "duplicateId",
        fires: [{ path: inPlanning("base.checklist.md"), text: `${TASK}${TASK}` }],
        passes: [{ path: inPlanning("base.checklist.md"), text: TASK }],
    },
    {
        rule: "checklist",
        kind: "danglingReference",
        fires: [{ path: inPlanning("base.checklist.md"), text: `${TASK}It depends on 3.2.1 landing first.\n` }],
        passes: [{ path: inPlanning("base.checklist.md"), text: `${TASK}It depends on 1.1.1 landing first.\n` }],
    },
    {
        rule: "checklist",
        kind: "danglingBinding",
        fires: [
            {
                path: inPlanning("base.checklist.md"),
                text: "### PHASE `structure-probe`\n- [ ] 1.1.1 DO it. *file:* x · *evidence:* y · *owner:* A · *verifier:* Z · *not:* z · *done:* w\n",
            },
        ],
        passes: [
            {
                path: inPlanning("base.checklist.md"),
                text: "### PHASE `structure-probe`\n- [ ] 1.1.1 DO it. *file:* x · *evidence:* y · *owner:* — · *verifier:* — · *not:* z · *done:* w\n",
            },
        ],
    },
    {
        rule: "checklist",
        kind: "axesMissing",
        fires: [{ path: inPlanning("base.checklist.md"), text: `DISTRIBUTES: probe${BLOCKING_SUFFIX}\n\n${TASK}` }],
        passes: [{ path: inPlanning("base.checklist.md"), text: TASK }],
    },
    {
        rule: "checklist",
        kind: "rippleMissing",
        fires: [{ path: inPlanning("base.checklist.md"), text: `DISTRIBUTES: probe${BLOCKING_SUFFIX}\n\n${TASK}` }],
        passes: [{ path: inPlanning("base.checklist.md"), text: TASK }],
    },
    {
        rule: "checklist",
        kind: "genesisMissing",
        fires: [{ path: inPlanning("base.checklist.md"), text: `DISTRIBUTES: probe${BLOCKING_SUFFIX}\n\n${TASK}` }],
        passes: [{ path: inPlanning("base.checklist.md"), text: TASK }],
    },
    {
        rule: "role",
        kind: "templateAbsent",
        onDisk: true,
        fires: [{ path: inRoles("probe.role.md"), text: `${ROLE_HEAD}# Name\n` }],
        passes: [ROLE_TEMPLATE_SAMPLE, { path: inRoles("probe.role.md"), text: `${ROLE_HEAD}# Name\n` }],
    },
    {
        rule: "governance",
        kind: "declarationContract",
        exempt:
            "this kind is emitted by the REGISTRY as it discovers and validates a check's declaration, before any " +
            "check runs — so it is not reachable from a fixture of the rule it is attributed to, whose own scan " +
            "never produces it. The attribution is honest rather than misplaced: the finding is published under this " +
            "id and a consumer resolves it here. It is proven on its REAL population on every run, because a " +
            "declaration failing the contract stops that check registering at all, and the certifier then reports the " +
            "rule as untested rather than the tree as clean — the failure is loud in a second surface rather than " +
            "silent in this one",
    },
    {
        rule: "placement",
        kind: "looseFileAtRoot",
        fires: [{ path: inTree("intel/base.record.md"), text: "body\n" }],
        passes: [{ path: inTree("intel/records/base.record.md"), text: "body\n" }],
    },
    {
        rule: "placement",
        kind: "undeclaredContainer",
        fires: [{ path: inTree("nonsense/records/base.record.md"), text: "body\n" }],
        passes: [{ path: inTree("intel/records/base.record.md"), text: "body\n" }],
    },
    {
        rule: "placement",
        kind: "dottedFolder",
        fires: [{ path: inTree("intel/base.records/base.record.md"), text: "body\n" }],
        passes: [{ path: inTree("intel/records/base.record.md"), text: "body\n" }],
    },
    {
        rule: "placement",
        kind: "nestedInSpecial",
        fires: [{ path: inTree("rules/records/base.record.md"), text: "body\n" }],
        passes: [{ path: inTree("rules/base.rule.md"), text: "body\n" }],
    },
    {
        rule: "placement",
        kind: "tooDeep",
        fires: [{ path: inSurface("tools/core/base/records/deep/base.record.md"), text: "body\n" }],
        passes: [{ path: inSurface("tools/core/records/base.record.md"), text: "body\n" }],
    },
    {
        rule: "placement",
        kind: "badShape",
        fires: [{ path: inTree("intel/Nonsense/base.record.md"), text: "body\n" }],
        passes: [{ path: inTree("intel/records/base.record.md"), text: "body\n" }],
    },
    {
        rule: "placement",
        kind: "roleOutOfOrder",
        fires: [{ path: inTree("intel/records/base/base.record.md"), text: "body\n" }],
        passes: [{ path: inTree("intel/base/records/base.record.md"), text: "body\n" }],
    },
    {
        rule: "placement",
        kind: "parentNotConcern",
        fires: [{ path: inTree("intel/base/base.record.md"), text: "body\n" }],
        passes: [{ path: inTree("intel/base/records/base.record.md"), text: "body\n" }],
    },
    {
        rule: "slot",
        kind: "undeclaredSlot",
        fires: [{ path: inTree("intel/records/base.nonsense.md"), text: "body\n" }],
        passes: [{ path: inTree("intel/records/base.record.md"), text: "body\n" }],
    },
    {
        rule: "slot",
        kind: "concernMismatch",
        fires: [{ path: inTree("intel/records/base.template.md"), text: "body\n" }],
        passes: [{ path: inTree("intel/records/base.record.md"), text: "body\n" }],
    },
    {
        rule: "slot",
        kind: "subjectEqualsConcern",
        fires: [{ path: inTree("intel/records/record.record.md"), text: "body\n" }],
        passes: [{ path: inTree("intel/records/base.record.md"), text: "body\n" }],
    },
    {
        rule: "slot",
        kind: "unparsable",
        fires: [{ path: inTree("intel/records/base.md"), text: "body\n" }],
        passes: [{ path: inTree("intel/records/base.record.md"), text: "body\n" }],
    },
    {
        rule: "tense",
        kind: "pastTense",
        fires: [
            { path: inTree("intel/records/base.record.md"), text: "The reader was previously a scanner.\n" },
        ],
        passes: [{ path: inTree("intel/records/base.record.md"), text: "The reader is a scanner.\n" }],
    },
    {
        rule: "tense",
        kind: "historySection",
        fires: [{ path: inTree("intel/records/base.record.md"), text: "## What changed\n" }],
        passes: [{ path: inTree("intel/records/base.record.md"), text: "## What it holds\n" }],
    },
    {
        rule: "tense",
        kind: "retiredStatus",
        fires: [{ path: inTree("intel/records/base.record.md"), text: "status: retired\n" }],
        passes: [{ path: inTree("intel/records/base.record.md"), text: "status: current\n" }],
    },
];
