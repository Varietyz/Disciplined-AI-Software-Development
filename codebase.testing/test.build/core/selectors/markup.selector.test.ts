import { describe, expect, it } from "vitest";
import { attributeOf } from "@banes-lab/build-scripts/core/selectors/markup.selector.ts";
import { parseTag } from "@banes-lab/build-scripts/core/converters/markup.converter.ts";

describe("attributeOf", () => {
    it("picks a parsed attribute by name and nothing for one the tag does not carry", () => {
        const tag = parseTag(`g class="node" data-id='a>b'`);
        expect(attributeOf(tag, "data-id")?.value).toBe("a>b");
        expect(attributeOf(tag, "style")).toBeUndefined();
    });
});
