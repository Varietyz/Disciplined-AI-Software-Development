import { describe, expect, it } from "vitest";
import { isConsumerCall, isRegisterCall } from "@project/scripts/core/predicates/closure.predicate.ts";

describe("isRegisterCall and isConsumerCall", () => {
    it("match a verb only at a camel-case boundary", () => {
        expect(isRegisterCall("registerPage")).toBe(true);
        expect(isRegisterCall("register")).toBe(false);
        expect(isRegisterCall("registered")).toBe(false);
        expect(isConsumerCall("getPage")).toBe(true);
        expect(isConsumerCall("getter")).toBe(false);
    });

    it("never files a registration or a platform lookup as a consumer", () => {
        expect(isConsumerCall("registerPage")).toBe(false);
        expect(isConsumerCall("getElementById")).toBe(false);
        expect(isConsumerCall("hasAttribute")).toBe(false);
    });
});
