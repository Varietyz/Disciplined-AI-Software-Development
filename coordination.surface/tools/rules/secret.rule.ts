import type { RuleContext, RuleDeclaration, RuleResult } from "../core/types/rule.types.ts";
import { bearsSecret, parseShapes } from "../core/predicates/secret.predicate.ts";
import { isResolved, slotList, slotText } from "../../config/surface.config.ts";
import type { Finding } from "../core/types/segment.types.ts";

const BEARER: string | null = isResolved("project", "credential_bearer")
    ? slotText("project", "credential_bearer")
    : null;

const BEARER_NAME = BEARER ?? "no declared bearer";

const SHAPES = parseShapes(slotList("convention", "secret_shapes"));

const basenameOf = function basenameOf(path: string): string {
    const slash = path.lastIndexOf("/");
    return slash === -1 ? path : path.slice(slash + 1);
};

const finding = function finding(path: string): Finding {
    return {
        actual: `${path} carries a value matching the credential shape`,
        expected:
            BEARER === null
                ? "no artifact is declared to bear a credential, so none may carry one"
                : `the credential appears only in ${BEARER}`,
        healed: false,
        line: 0,
        locus: basenameOf(path),
        path,
        remediation: {
            action: "move",
            decide:
                BEARER === null
                    ? "no artifact here is declared to bear a credential — remove the value and read it from the environment at runtime; treat the copy as disclosed and rotate it, because an artifact that carried it once may have been distributed"
                    : `a credential has exactly one home and this is not it — remove the value from this artifact and read it from ${BEARER} at runtime; treat the copy as disclosed and rotate it, because an artifact that carried it once may have been distributed`,
            deterministic: false,
            from: path,
            target: path,
            to: null,
        },
        rule: "secret/secretOutsideItsBearer",
        stack: [
            { check: "shape", resolved: "matched" },
            { check: "bearer", resolved: BEARER_NAME },
            { check: "location", resolved: "outside the bearer" },
        ],
    };
};

export const rule: RuleDeclaration = {
    check(context: RuleContext): RuleResult {
        const findings: Finding[] = [];
        const reached: string[] = [];
        const skippedAsDeclaredBearer: string[] = [];

        for (const path of context.paths) {
            if (BEARER !== null && basenameOf(path) === BEARER) {
                skippedAsDeclaredBearer.push(path);
                continue;
            }
            reached.push(path);

            if (bearsSecret(context.read(path), SHAPES)) {
                findings.push(finding(path));
            }
        }

        return {
            derivations: { bearer: BEARER_NAME, reached, shapes: SHAPES.length, skippedAsDeclaredBearer },
            findings,
            healed: [],
        };
    },
    extensions: [],
    heals: false,
    invariant: "a credential appears only in the single artifact declared to bear it",
    jurisdiction: "all",
    kinds: ["secretOutsideItsBearer"],

    stage: "content",
};
