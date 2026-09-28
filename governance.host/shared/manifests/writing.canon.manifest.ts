import type { CanonCheckId, CanonLayer, CanonLayerId } from "../../types/writing.types.ts";
import { DOCUMENT_LAYER } from "./writing.document.manifest.ts";
import { IDENTIFIER_LAYER } from "./writing.identifier.manifest.ts";
import { NOTE_LAYER } from "./writing.note.manifest.ts";
import { OUTPUT_LAYER } from "./writing.output.manifest.ts";
import { PROSE_LAYER } from "./writing.prose.manifest.ts";
import { ROOT_LAYER } from "./writing.root.manifest.ts";
import { SHORT_LAYER } from "./writing.short.manifest.ts";

export const WRITING_CANON: readonly CanonLayer[] = [
    ROOT_LAYER,
    PROSE_LAYER,
    SHORT_LAYER,
    OUTPUT_LAYER,
    IDENTIFIER_LAYER,
    DOCUMENT_LAYER,
    NOTE_LAYER,
];

export const STRINGS_CHANNEL: CanonLayerId = "prose";

export const DOCUMENT_CHANNEL: CanonLayerId = "document";

export const CANON_PRECEDENCE = "CLAUDE.md > this canon > the rules and manifests on disk > memory";

export const isCheckEnforced = function isCheckEnforced(id: CanonCheckId, channel: CanonLayerId): boolean {
    return WRITING_CANON.some((layer) =>
        layer.rules.some((rule) => rule.checks.some((check) => check.id === id && check.enforcedIn.includes(channel))),
    );
};
