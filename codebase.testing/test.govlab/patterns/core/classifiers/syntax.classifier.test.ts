import {
    ROLE_CALL,
    ROLE_DEFINITION,
    ROLE_NODE,
    roleOf,
    stateOf,
} from "@govlab/patterns/core/classifiers/syntax.classifier.ts";
import { describe, expect, it } from "vitest";

describe("the syntax classifier", () => {
    it("roleOf reads the role from the node-type convention", () => {
        expect(roleOf("call_expression")).toBe(ROLE_CALL);
        expect(roleOf("function_declaration")).toBe(ROLE_DEFINITION);
        expect(roleOf("declaration_list")).toBe(ROLE_NODE);
        expect(roleOf("identifier")).toBe(ROLE_NODE);
    });

    it("stateOf takes the first matching state rule and defaults to structure", () => {
        expect(stateOf("call_expression")).toBe("call");
        expect(stateOf("assignment_expression")).toBe("write");
        expect(stateOf("lexical_declaration")).toBe("declare");
        expect(stateOf("if_statement")).toBe("control");
        expect(stateOf("member_expression")).toBe("read");
        expect(stateOf("program")).toBe("structure");
    });
});
