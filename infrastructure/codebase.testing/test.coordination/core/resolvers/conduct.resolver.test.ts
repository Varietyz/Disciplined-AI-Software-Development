import {
    CERTIFIED_KIND_LABEL,
    ENTRY_COMMAND_LABEL,
    PIPELINE_STEP_LABEL,
    REGISTERED_RULE_LABEL,
} from "coordination-surface/tools/core/strings/conduct.strings.ts";
import { corpusOf, observerResolves } from "coordination-surface/tools/core/resolvers/conduct.resolver.ts";
import { describe, it } from "vitest";
import { FAILING_QUESTIONS } from "coordination-surface/tools/core/constants/conduct.constants.ts";
import assert from "node:assert/strict";

const [QUESTION = ""] = FAILING_QUESTIONS;
const RULES = new Set(["board", "shared"]);
const STEPS = new Set(["gates", "shared"]);
const COMMANDS = new Set(["await"]);
const CERTIFIED = new Set(["board/fence"]);

describe("corpusOf", () => {
    it("names the corpus each member of a cell resolves in, or that it resolves nowhere", () => {
        const named = corpusOf(
            `board shared await board/fence ${QUESTION} ghost other/x`,
            RULES,
            STEPS,
            COMMANDS,
            CERTIFIED,
            new Set(),
        );
        assert.equal(
            named,
            [
                `board → ${REGISTERED_RULE_LABEL}`,
                `shared → ${REGISTERED_RULE_LABEL} and ${PIPELINE_STEP_LABEL}`,
                `await → ${ENTRY_COMMAND_LABEL}`,
                `board/fence → ${CERTIFIED_KIND_LABEL}`,
                `${QUESTION} → failing question`,
                "ghost → unresolved",
                "other/x → unkeyed",
            ].join(", "),
        );
    });
});

describe("observerResolves", () => {
    it("accepts a cell whose every member is registered or keyed, or a failing question standing alone", () => {
        assert.equal(observerResolves("board board/fence", RULES, CERTIFIED), true);
        assert.equal(observerResolves(QUESTION, RULES, CERTIFIED), true);
        assert.equal(observerResolves(`${QUESTION} board`, RULES, CERTIFIED), false);
        assert.equal(observerResolves("ghost", RULES, CERTIFIED), false);
        assert.equal(observerResolves("  ", RULES, CERTIFIED), false);
    });
});
