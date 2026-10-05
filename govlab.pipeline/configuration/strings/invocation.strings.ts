export const GATE_COMMAND = "npm run verify --";

export const GATE_SUMMARY =
    "Run the gate: every stage in order for the gated members, or the members, stages and steps the flags narrow it to.";

export const BYPASS_FLAG = "skip the stages with these slugs, as a comma list";

export const RUN_FLAG = "run these stages that are bypassed by default, as a comma list";

export const MEMBER_FLAG = "narrow every per-member step to these member ids, as a comma list";

export const ONLY_FLAG = "run only the steps whose label contains one of these words, as a comma list";

export const TAG_FLAG = "run only the steps carrying one of these tags, as a comma list";

export const SKIP_TAG_FLAG = "skip the steps carrying one of these tags, as a comma list";

export const REPORT_FLAG = "run every step instead of stopping at the first failure, then print the per-stage totals";
