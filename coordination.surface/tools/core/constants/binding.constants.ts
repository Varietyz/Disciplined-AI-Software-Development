import { AGENT_ROOT, TEMPLATE_ROOT } from "./template.constants.ts";
import { packagePath, slotText, surfacePath } from "../../../config/surface.config.ts";

export const BINDING_PATH = surfacePath("binding");

export const CONFIGURATION_PATH = packagePath(slotText("project", "runtime_adapter"));

export const SLOT_CONSUMERS = [TEMPLATE_ROOT, AGENT_ROOT];

export const RESOLUTION_STATES = ["RESOLVED", "ABSENT", "DEFERRED"] as const;
