import type { CanonLayer } from "../../types/writing.types.ts";
import { LAYER_TITLES } from "../strings/writing.strings.ts";
import { relativePath } from "@ssot/paths";

const DIGESTS = `${relativePath("claude.root")}/rules`;

export const DOCUMENT_LAYER: CanonLayer = {
    covers: ["guides, references, protocols and checklists", "plans and rule digests", "internal documentation"],
    defersTo: [
        { covers: "document types, frontmatter and placement", path: `${DIGESTS}/doc-arch.md` },
        { covers: "the internal voice", path: `${DIGESTS}/content-strings.md` },
    ],
    id: "document",
    intro: "A document is read by the developer and by the model, often cold, so it states what is true now and where each claim comes from.",
    rules: [
        {
            bans: [
                "a claim about the tree that was not read in the current session",
                "a history of how the text changed",
            ],
            checks: [],
            conditions: ["a document that disagrees with the tree is corrected the same turn"],
            examples: [],
            gate: null,
            id: "document.true-now",
            rule: "A document states what is true now.",
            why: "A stale document is read as current.",
        },
        {
            bans: [
                "corporate register",
                "grandiose labels",
                "a preamble",
                "capitals, emoji or warning symbols used for emphasis",
            ],
            checks: [],
            conditions: [
                "sentence case, with identifiers, paths and product names exact",
                "the voice follows the audience and not the casing, so a note about a strings file is internal text while the values in the file are copy",
            ],
            examples: [
                {
                    rejected: "🚨 THE ONLY THING THAT IS TRUE IS WHAT IS ON DISK 🚨",
                    repaired: "The disk is the only truth",
                    why: "The emoji and capitals raise the volume and add no fact.",
                },
            ],
            gate: null,
            id: "document.internal-voice",
            rule: "Internal text uses short, exact sentences.",
            why: "The reader needs the path and the fact, not a tone.",
        },
    ],
    title: LAYER_TITLES.document,
};
