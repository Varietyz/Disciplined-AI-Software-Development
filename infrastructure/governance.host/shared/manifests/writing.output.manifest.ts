import type { CanonLayer } from "../../types/writing.types.ts";
import { LAYER_TITLES } from "../strings/writing.strings.ts";
import { relativePath } from "@ssot/paths";

const DIGESTS = `${relativePath("claude.root")}/rules`;

export const OUTPUT_LAYER: CanonLayer = {
    covers: [
        "errors, warnings and findings",
        "remediations, info and debug lines",
        "logs, reports and terminal output",
    ],
    defersTo: [
        {
            covers: "gate ids and messages: the shape and its one fix, provider-agnostic",
            path: `${DIGESTS}/custom-gates.md`,
        },
        { covers: "which text is public copy and which is internal", path: `${DIGESTS}/content-strings.md` },
    ],
    id: "output",
    intro: "A line a tool prints is read by the developer at the moment something went wrong, so it names the thing and the way out.",
    rules: [
        {
            bans: [
                "a coined term",
                'an ambiguous "it"',
                '"the tree" with no referent',
                "a finding with no reason",
                "a finding with no operands",
            ],
            checks: [],
            conditions: ["a refusal gives the reason and the next action"],
            examples: [],
            gate: null,
            id: "output.finding",
            rule: "A finding names the file, the thing that does not hold, why, and the change that removes it, with its operands.",
            why: "A finding the developer cannot act on without reading the source is not finished.",
        },
        {
            bans: [],
            checks: [],
            conditions: [],
            examples: [
                {
                    rejected: "…failed validation, so nothing was uploaded",
                    repaired: null,
                    why: "The reader already infers that nothing was uploaded.",
                },
            ],
            gate: null,
            id: "output.neighbor-form",
            rule: "A terminal or log line matches the form of its neighbors and states no inferred consequence.",
            why: "Lines of one tool read as one voice.",
        },
    ],
    title: LAYER_TITLES.output,
};
