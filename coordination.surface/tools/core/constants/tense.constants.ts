import { DIGEST_ROOT, SKILL_ROOT } from "./template.constants.ts";
import { historyPath } from "../../../config/surface.config.ts";

export const PAST_MARKERS = [
    "previously",
    "formerly",
    "originally",
    "no longer",
    "renamed from",
    "renamed to",
    "moved from",
    "used to be",
    "turned out to be",
    "at some point",
    "has since been",
    "have since been",
    "we removed",
    "we deleted",
    "we renamed",
    "we replaced",
    "this replaced",
    "was replaced by",
    "was renamed",
    "was moved",
    "was removed from",
];

export const STATUS_MARKERS = ["status: retired", "status: deprecated", "status: superseded"];

export const HISTORY_HEADINGS = ["what changed", "change notes", "migration notes", "upgrade notes", "changelog"];

export const TENSE_EXEMPT = [historyPath(), `${DIGEST_ROOT}document.rule.md`, `${SKILL_ROOT}writing-style/SKILL.md`];

export { UPSTREAM_ROOTS as TENSE_EXEMPT_ROOTS } from "./path.constants.ts";

export const ACCUMULATOR_MARKER = "_";
