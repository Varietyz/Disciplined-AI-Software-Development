import { describe, expect, it } from "vitest";
import type { PageSection } from "@banes-lab/content/types/writing.types.ts";
import { linkChanges } from "@banes-lab/content/core/validators/link.validator.ts";

const section = function section(key: string, links: string[]): PageSection {
    const [page = key] = key.split("#");
    return { fingerprint: "f", key, links, page };
};

describe("linkChanges", () => {
    it("reports nothing while every baseline link stays in its section", () => {
        const changes = linkChanges({ "p#a": ["/x"] }, [section("p#a", ["/x", "/new"])]);
        expect(changes).toStrictEqual({ lost: [], moved: [] });
    });

    it("tells a link that moved to another section of the page from one that left the page", () => {
        const changes = linkChanges({ "p#a": ["/x", "/y"] }, [section("p#a", []), section("p#b", ["/x"])]);
        expect(changes.moved).toStrictEqual([{ key: "p#a", target: "/x" }]);
        expect(changes.lost).toStrictEqual([{ key: "p#a", target: "/y" }]);
    });

    it("reports every link of a section that no longer exists as lost", () => {
        expect(linkChanges({ "p#gone": ["/x"] }, []).lost).toStrictEqual([{ key: "p#gone", target: "/x" }]);
    });
});
