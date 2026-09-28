import { surfacePath } from "../../../config/surface.config.ts";

export const REPORT_SUFFIX = ".report.generated.json";

export const SKIP_PREFIX = "skipped";

export const STEP_DIR = surfacePath("steps");

export const RULE_DIR = surfacePath("rules");

export const EMISSION_CALL = "writeRuleReport(";

export const FINDING_EMISSION = "findings.push({";
