import {
    DECLARATION_KEYS,
    type RegisteredRule,
    type Registry,
    type RuleDeclaration,
    STAGES,
} from "../types/rule.types.ts";
import type { Finding } from "../types/segment.types.ts";
import type { LoadedSource } from "../types/source.types.ts";

import { fieldOf } from "../readers/json.reader.ts";
import { importSources } from "../readers/source.reader.ts";
import { resolve } from "node:path";
import { surfacePath } from "../../../config/surface.config.ts";
import { walk } from "../iterators/file.iterator.ts";

const RULES_DIR = surfacePath("rules");

type FieldCheck = (path: string, value: object) => Finding[];

interface Validated {
    readonly source: LoadedSource;
    readonly problems: readonly Finding[];
    readonly declaration: RuleDeclaration | null;
}

export const identityOf = function identityOf(path: string): string {
    const cut = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
    const name = path.slice(cut + 1);
    const stop = name.indexOf(".");
    return stop === -1 ? name : name.slice(0, stop);
};

const contractFinding = function contractFinding(path: string, locus: string, actual: string, decide: string): Finding {
    return {
        actual,
        expected: null,
        healed: false,
        line: 0,
        locus,
        path,
        remediation: { action: "declare", decide, deterministic: false, from: actual, target: path, to: null },
        rule: "governance/declarationContract",
        stack: [
            { check: "discover", resolved: path },
            { check: "declaration", resolved: locus },
        ],
    };
};

interface FieldContract {
    readonly field: string;
    readonly holds: (value: unknown) => boolean;
    readonly shown: (value: unknown) => string;
    readonly decide: string;
}

const missingKeys: FieldCheck = (path, value) =>
    DECLARATION_KEYS.filter((key) => !(key in value)).map((key) =>
        contractFinding(path, key, "missing", `add the required declaration field "${key}"`),
    );

const declaredId: FieldCheck = (path, value) =>
    "id" in value
        ? [
              contractFinding(
                  path,
                  "id",
                  "declared",
                  "a check's identity is DERIVED from its filename subject and is never declared beside it — one fact declared twice is two classifications with nothing keeping them equal, and the divergence is unconstructible only once the second declaration is gone. Delete the field; the registry supplies the id",
              ),
          ]
        : [];

const isKindList = function isKindList(kinds: unknown): boolean {
    return Array.isArray(kinds) && kinds.every((kind: unknown) => typeof kind === "string" && kind.length > 0);
};

const FIELD_CONTRACTS: readonly FieldContract[] = [
    {
        decide: "kinds is an array of every kind this check emits, DECLARED rather than recovered from its own source — a set recovered by matching spellings has a quote style to prefer, a depth to bound and an attribution to guess, so a check composing its kind dynamically is invisible to the recovery and the set that reports an unfixtured kind subtracts from an empty population and can never report a gap for it. Where the kinds range over a closed vocabulary, spread that vocabulary here rather than transcribing its members",
        field: "kinds",
        holds: isKindList,
        shown: String,
    },
    {
        decide: `stage is one of ${STAGES.join(", ")}`,
        field: "stage",
        holds: (stage) => STAGES.some((known) => known === stage),
        shown: String,
    },
    {
        decide: "state the invariant in one present-tense line",
        field: "invariant",
        holds: (invariant) => typeof invariant === "string" && invariant.length > 0,
        shown: String,
    },
    {
        decide: "extensions is an array; empty means every file in scope",
        field: "extensions",
        holds: Array.isArray,
        shown: String,
    },
    { decide: "heals is a boolean", field: "heals", holds: (heals) => typeof heals === "boolean", shown: String },
    {
        decide: "check is (context, fix) => RuleResult",
        field: "check",
        holds: (check) => typeof check === "function",
        shown: (check) => typeof check,
    },
];

const brokenContracts: FieldCheck = (path, value) =>
    FIELD_CONTRACTS.filter((contract) => !contract.holds(fieldOf(value, contract.field))).map((contract) =>
        contractFinding(path, contract.field, contract.shown(fieldOf(value, contract.field)), contract.decide),
    );

const FIELD_CHECKS: readonly FieldCheck[] = [missingKeys, declaredId, brokenContracts];

const isDeclaration = function isDeclaration(value: object, path: string): value is RuleDeclaration {
    return FIELD_CHECKS.every((check) => check(path, value).length === 0);
};

const validated = function validated(source: LoadedSource): Validated {
    if (source.exports === null) {
        const imported = contractFinding(
            source.file,
            "import",
            source.error ?? "",
            "the rule file must import cleanly with no side effects",
        );
        return { declaration: null, problems: [imported], source };
    }

    const value = source.exports["rule"];
    if (typeof value !== "object" || value === null) {
        const exported = contractFinding(
            source.file,
            "export rule",
            String(value),
            "export a `rule` object satisfying RuleDeclaration",
        );
        return { declaration: null, problems: [exported], source };
    }

    const problems = FIELD_CHECKS.flatMap((check) => check(source.file, value));
    return { declaration: isDeclaration(value, source.file) ? value : null, problems, source };
};

const byStageThenId = function byStageThenId(left: RegisteredRule, right: RegisteredRule): number {
    const byStage = STAGES.indexOf(left.declaration.stage) - STAGES.indexOf(right.declaration.stage);
    return byStage === 0 ? left.id.localeCompare(right.id, "en") : byStage;
};

const registered = function registered(check: Validated): RegisteredRule[] {
    return check.declaration === null
        ? []
        : [{ declaration: check.declaration, id: identityOf(check.source.file), path: check.source.file }];
};

const collisionOf = function collisionOf(rule: RegisteredRule, first: RegisteredRule): Finding {
    const collision = `identity collides with the rule discovered at ${first.path} — a filename subject names exactly one check`;
    return contractFinding(rule.path, "id", rule.id, collision);
};

export const discoverRules = async function discoverRules(repoRoot: string): Promise<Registry> {
    const sources = await importSources(walk({ extensions: [".ts"], ignored: [], root: resolve(repoRoot, RULES_DIR) }));
    const checked = sources.map(validated);
    const valid = checked.flatMap(registered);
    const firstOf = (rule: RegisteredRule): RegisteredRule => valid.find((other) => other.id === rule.id) ?? rule;

    const rules = valid.filter((rule) => firstOf(rule) === rule);
    const collisions = valid.filter((rule) => firstOf(rule) !== rule).map((rule) => collisionOf(rule, firstOf(rule)));

    return {
        findings: [...checked.flatMap((check) => check.problems), ...collisions],
        rules: rules.toSorted(byStageThenId),
    };
};
