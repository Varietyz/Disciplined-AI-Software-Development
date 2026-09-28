import { isResolved, slotCount, slotText, surfacePath } from "../../../config/surface.config.ts";

export const BOARD_PATH = surfacePath("board");

export const AGENT_INDEX = surfacePath("agent_index");

export const COMMS_TEMPLATE = surfacePath("board_template");

export const AGENT_FIELDS = ["Owns", "Status", "Flags", "Refs"];

export const GATE_FIELDS = ["State", "Owner", "Blocker"];

export const JUDGEMENT_KIND = "judgement";

export const ITEM_KINDS = ["artifact", JUDGEMENT_KIND];

export const ANSWER_PREFIX = "Answer-";

export const CLAIM_WORDS = 12;

export const AGENT_LABEL = "Agent";

export const BOARD_STATES = ["PASS", "RED", "PENDING"];

export const STALE_MARKERS = ["DONE", "SUPERSEDED", "ACK"];

export const PROJECTION_HOST: string | null = isResolved("project", "governance_policy")
    ? slotText("project", "governance_policy")
    : null;

export const PROJECTION_MARKER = slotText("project", "projection_marker");

export const PROJECTION_DEFAULT = "no board raised";

export const PROJECTION_CAP_CHARS = slotCount("convention", "projection_cap_chars");

export const WAIT_COMMAND = slotText("execution", "wait_command");

export const READ_TOKEN_BUDGET = slotCount("convention", "read_token_budget");

export const CHARS_PER_TOKEN = slotCount("convention", "chars_per_token");

export const READ_BUDGET_CHARS = READ_TOKEN_BUDGET * CHARS_PER_TOKEN;
