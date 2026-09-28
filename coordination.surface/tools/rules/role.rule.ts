import { ROLE_ROOT, ROLE_TEMPLATE } from "../core/constants/template.constants.ts";
import type { RuleContext, RuleDeclaration, RuleResult } from "../core/types/rule.types.ts";
import { checkRoleCoverage, checkRoleShape } from "../core/inspectors/role.inspector.ts";
import { AGENT_INDEX } from "../core/constants/board.constants.ts";
import type { Finding } from "../core/types/segment.types.ts";
import { activeSeatLetters } from "../core/inspectors/index.inspector.ts";
import { underRoots } from "../core/filters/scope.filter.ts";

const finding = function finding(
    path: string,
    kind: string,
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
        rule: `role/${kind}`,
        stack: [
            { check: "role", resolved: path },
            { check: kind, resolved: locus },
        ],
    };
};

export const rule: RuleDeclaration = {
    check(context: RuleContext): RuleResult {
        const scoped = underRoots(context.paths, [ROLE_ROOT]);

        if (!context.exists(ROLE_TEMPLATE)) {
            return {
                derivations: { letters: [], roles: scoped.length },
                findings: [
                    finding(
                        ROLE_TEMPLATE,
                        "templateAbsent",
                        "role",
                        "the role template the section contract derives from does not exist",
                        "a role template carrying the frontmatter operands and the section headings every role document answers to",
                        "the contract is DERIVED from the template rather than transcribed into this check, so an absent template leaves the check with nothing to enforce — and a check resolving its contract to an empty set passes every document vacuously, which is the shape a green reports over a surface nobody governs. Raise the template rather than restoring a transcribed list",
                    ),
                ],
                healed: [],
            };
        }

        const template = context.read(ROLE_TEMPLATE);
        const letters = activeSeatLetters(context.read(AGENT_INDEX));

        const shapes = scoped.flatMap((path) =>
            checkRoleShape(path, context.read(path), template, (kind, locus, actual, expected, decide) =>
                finding(path, kind, locus, actual, expected, decide),
            ),
        );
        const coverage = checkRoleCoverage(letters, scoped, (kind, locus, actual, expected, decide) =>
            finding(AGENT_INDEX, kind, locus, actual, expected, decide),
        );

        return { derivations: { letters, roles: scoped.length }, findings: [...shapes, ...coverage], healed: [] };
    },
    extensions: [".md"],
    heals: false,
    invariant: "every role document carries the same section set and the same declared operands",
    jurisdiction: "taxonomy",
    kinds: ["templateAbsent", "roleMissing", "roleFieldMissing", "roleSectionMissing", "measuredSectionUnfilled"],
    reads: [AGENT_INDEX, ROLE_TEMPLATE],

    stage: "content",

    wholeScopeOnly: true,
};
