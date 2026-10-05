import { slotList, surfacePath } from "../../../config/surface.config.ts";

const within = function within(folder: string): string {
    return `${surfacePath("behavior_tree")}/${folder}/`;
};

export const TEMPLATE_ROOT = within("templates");

export const EXECUTED_TEMPLATES = ["checklist", "claim", "pattern", "agent", "layer"];

export const MANDATORY_GATES = ["tel-priority", "constrain", "ver-stop", "ter-stop"];

export const AGENT_ROOT = `${surfacePath("agents")}/`;

export const SKILL_ROOT = within("skills");

export const DIGEST_ROOT = `${surfacePath("rule_digests")}/`;

export const INTEL_ROOT = within("intel");

export const ROLE_ROOT = `${surfacePath("roles")}/`;

export const ROLE_TEMPLATE = surfacePath("role_template");

export const FRONTMATTER_FENCE = "---";

export const IDENTITY_MARKER = "THIS AGENT IS";

export const PROTOCOL_SKILL = "collaboration-protocol";

export const SKILLS_MARKER = "SKILLS:";

export const SUPPORTED_AGENT_KEYS = slotList("convention", "agent_keys");
