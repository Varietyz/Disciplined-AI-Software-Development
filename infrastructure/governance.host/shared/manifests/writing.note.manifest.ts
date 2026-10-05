import type { CanonLayer } from "../../types/writing.types.ts";
import { LAYER_TITLES } from "../strings/writing.strings.ts";

export const NOTE_LAYER: CanonLayer = {
    covers: ["chat replies and questions to the developer", "commit messages and changelogs", "memory files and notes"],
    defersTo: [],
    id: "note",
    intro: "A note is read later, out of the context it was written in.",
    rules: [
        {
            bans: ["a question asked as prose", "a question with previews", "a question whose answer is already given"],
            checks: [],
            conditions: [],
            examples: [],
            gate: null,
            id: "note.questions",
            rule: "Every open decision is asked through the question tool, recommendation first.",
            why: "A prose question gets lost in the reply, and a preview cannot be answered.",
        },
        {
            bans: ["recording the single instance of a mistake"],
            checks: [],
            conditions: ["a correction given twice becomes a rule with a slug, a directive and its gate"],
            examples: [],
            gate: null,
            id: "note.record-the-class",
            rule: "A recorded correction names the class of mistake.",
            why: "An instance does not recur, while its class does.",
        },
    ],
    title: LAYER_TITLES.note,
};
