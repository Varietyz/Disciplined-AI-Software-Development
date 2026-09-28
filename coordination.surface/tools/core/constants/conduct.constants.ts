import { DIGEST_ROOT } from "./template.constants.ts";

export const FAILING_QUESTIONS: readonly string[] = [
    "no-declared-surface",
    "subject-is-an-act",
    "empty-population",
    "not-evaluable",
];

export const PAIR_SEPARATOR = "/";

export const ROSTER = `${DIGEST_ROOT}conduct.rule.md`;
