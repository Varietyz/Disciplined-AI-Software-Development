import {
    AGENT_ROOT,
    EXECUTED_TEMPLATES,
    MANDATORY_GATES,
    SKILL_ROOT,
    TEMPLATE_ROOT,
} from "../core/constants/template.constants.ts";
import { type Dirent, existsSync, readFileSync, readdirSync } from "node:fs";
import type { RuleContext, RuleDeclaration, RuleResult } from "../core/types/rule.types.ts";
import { checkIdentity, checkKeys } from "../core/inspectors/agent.inspector.ts";
import { AGENT_INDEX } from "../core/constants/board.constants.ts";
import type { Finding } from "../core/types/segment.types.ts";
import { indexedLetters } from "../core/inspectors/index.inspector.ts";
import { underRoots } from "../core/filters/scope.filter.ts";

const basenameOf = function basenameOf(path: string): string {
    const slash = path.lastIndexOf("/");
    return slash === -1 ? path : path.slice(slash + 1);
};

const isExecuted = function isExecuted(path: string): boolean {
    const name = basenameOf(path);
    return EXECUTED_TEMPLATES.some((marker) => name.startsWith(`${marker}.`));
};

const finding = function finding(
    kind: string,
    path: string,
    locus: string,
    actual: string,
    expected: string,
    decide: string,
): Finding {
    return {
        actual,
        expected,
        healed: false,
        line: 1,
        locus,
        path,
        remediation: { action: "declare", decide, deterministic: false, from: locus, target: path, to: null },
        rule: `template/${kind}`,
        stack: [
            { check: "template", resolved: basenameOf(path) },
            { check: kind, resolved: locus },
        ],
    };
};

interface Artifact {
    readonly path: string;
    readonly source: string;
}

const entriesOf = function entriesOf(root: string): Dirent[] {
    return existsSync(root) ? readdirSync(root, { withFileTypes: true }) : [];
};

const agentArtifacts = function agentArtifacts(repoRoot: string): Artifact[] {
    const root = `${repoRoot}/${AGENT_ROOT}`;
    return entriesOf(root)
        .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
        .map((entry) => ({ path: `${AGENT_ROOT}${entry.name}`, source: readFileSync(`${root}${entry.name}`, "utf8") }));
};

const skillNames = function skillNames(repoRoot: string): Set<string> {
    const root = `${repoRoot}/${SKILL_ROOT}`;
    return new Set(
        entriesOf(root)
            .filter((entry) => entry.isDirectory() && existsSync(`${root}${entry.name}/SKILL.md`))
            .map((entry) => entry.name),
    );
};

const TEMPLATE_GATE_DECIDE =
    "the four gates never fold — worth, admissibility, evidence and termination run on every execution, and a template that omits one cannot be executed as stated";

const AGENT_GATE_DECIDE =
    "an executed artifact walks its template's loop as stated, and the four gates never fold — an agent omitting one was template-shaped rather than template-executed, which is the difference the rule exists to hold";

const gateFindings = function gateFindings(path: string, source: string, decide: string): Finding[] {
    return MANDATORY_GATES.filter((gate) => !source.includes(gate)).map((gate) =>
        finding(
            "gateMissing",
            path,
            gate,
            `${basenameOf(path)} does not declare the ${gate} gate`,
            MANDATORY_GATES.join(", "),
            decide,
        ),
    );
};

interface AgentScope {
    readonly letters: ReadonlySet<string>;
    readonly skills: ReadonlySet<string>;
}

const agentFindings = function agentFindings(artifact: Artifact, scope: AgentScope): Finding[] {
    const name = basenameOf(artifact.path);
    const build = (kind: string, locus: string, actual: string, expected: string, decide: string): Finding =>
        finding(kind, artifact.path, locus, actual, expected, decide);
    return [
        ...checkKeys(name, artifact.source, build),
        ...checkIdentity(name, artifact.source, scope.letters, scope.skills, build),
        ...gateFindings(artifact.path, artifact.source, AGENT_GATE_DECIDE),
    ];
};

const templateFindings = function templateFindings(path: string, source: string, scoped: readonly string[]): Finding[] {
    const imported = scoped.filter((other) => other !== path && source.includes(basenameOf(other)));
    return [
        ...gateFindings(path, source, TEMPLATE_GATE_DECIDE),
        ...imported.map((other) =>
            finding(
                "templateImported",
                path,
                basenameOf(other),
                `${basenameOf(path)} references ${basenameOf(other)}`,
                "each template inlines its whole structure",
                "the templates deliberately duplicate their spine so each stays independently executable; refactoring them toward a shared import is the one place the duplication rule is overruled",
            ),
        ),
    ];
};

export const rule: RuleDeclaration = {
    check(context: RuleContext): RuleResult {
        const scoped = underRoots(context.paths, [TEMPLATE_ROOT]);
        const artifacts = agentArtifacts(context.repoRoot);
        const scope: AgentScope = {
            letters: indexedLetters(context.read(AGENT_INDEX)).letters,
            skills: skillNames(context.repoRoot),
        };

        const findings = [
            ...scoped.filter(isExecuted).flatMap((path) => templateFindings(path, context.read(path), scoped)),
            ...artifacts.flatMap((artifact) => agentFindings(artifact, scope)),
        ];
        const agents = artifacts.map((artifact) => basenameOf(artifact.path));

        return { derivations: { agents, templates: scoped.map(basenameOf) }, findings, healed: [] };
    },
    extensions: [".md"],
    heals: false,
    invariant: "an executed template and every artifact executed from one declare all mandatory gates",
    jurisdiction: "taxonomy",
    kinds: [
        "gateMissing",
        "letterNotInName",
        "participationUndeclared",
        "participationUnindexed",
        "protocolNotPreloaded",
        "skillDoesNotResolve",
        "templateImported",
        "undeliveredKey",
    ],
    readsTree:
        "an agent artifact is the executed half of this rule's subject and it lives in a tree the taxonomy " +
        "declares FOREIGN — its filenames are identifiers a runtime resolves, so the naming gates must not " +
        "reach it and it is absent from every readable path set; the rule reads that tree directly because " +
        "its subject is declared out of scope by design rather than because the rule reaches past its own",

    stage: "content",
};
