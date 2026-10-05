import { AUTHORED_ROLES, ROLE_BY_EXT } from "@govlab/stats/configuration/constants/source.constants.ts";
import { describe, expect, it } from "vitest";
import { isAuthoredRole, roleOf } from "@govlab/stats/core/classifiers/source.classifier.ts";

describe("roleOf", () => {
    it("maps every declared extension to its declared role", () => {
        for (const [ext, role] of ROLE_BY_EXT) {
            expect(roleOf(ext)).toBe(role);
        }
    });

    it("falls to other for an unmapped extension rather than guessing", () => {
        expect(roleOf(".glsl")).toBe("other");
        expect(roleOf("")).toBe("other");
    });
});

describe("isAuthoredRole", () => {
    it("counts the authored roles as the codebase and nothing else", () => {
        for (const role of AUTHORED_ROLES) {
            expect(isAuthoredRole(role)).toBe(true);
        }
        expect(isAuthoredRole("data")).toBe(false);
        expect(isAuthoredRole("other")).toBe(false);
    });
});
