import { packagePath, surfacePath } from "../../../config/surface.config.ts";

export const BLOCKING_SUFFIX = ".blocking.md";

export const VENUE_TEMPLATE = surfacePath("venue_template");

export const VENUE_ARCHIVE = `${surfacePath("venue_archive")}/`;

export const AGENDA = surfacePath("agenda");

export const AGENDA_PLAN = packagePath("config/agenda.config.ts");

export const RESOLUTION_HEADING = "## Exit condition";

export const UNREAD_MARKER = "NOT-READ:";

export const AWAITING_MARKER = "READ AND AWAITING:";

export const PROTOCOL_BANNER = "═══════════════════ PROTOCOL (permanent) ═══════════════════";

export const INHERITED_BANNER = "═══════════════════ INHERITED";

export const RECORD_ABSENT = "—";

export const LIST_MARKER = "- ";

export const POSITION_MARKER = "Position ";
