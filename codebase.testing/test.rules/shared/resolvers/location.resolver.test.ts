import {
    MEMBER_PATHS_CONFIGS,
    WRITE_GOVERNED_MEMBERS,
    governsOwnWrites,
} from "@ssot/govlab/shared/resolvers/location.resolver.ts";
import { describe, expect, it } from "vitest";
import { absolutePath } from "@ssot/paths";
import { sep } from "node:path";

const posix = function posix(path: string): string {
    return path.split(sep).join("/");
};

describe("the self-governed member declarations", () => {
    const coordination = posix(absolutePath("app.coordination"));

    it("read the paths config and the write gate each self-governed manifest names", () => {
        expect(MEMBER_PATHS_CONFIGS.has(`${coordination}/config/surface.config.ts`)).toBe(true);
        expect(WRITE_GOVERNED_MEMBERS).toContain(coordination);
    });

    it("leave write governance to the member only for files inside it", () => {
        expect(governsOwnWrites(`${coordination}/tools/core/runners/venue.runner.ts`)).toBe(true);
        const member = posix(absolutePath("app.member"));
        expect(governsOwnWrites(`${member}/core/registries/probe.registry.ts`)).toBe(false);
    });
});
