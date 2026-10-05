import { CANON_PRECEDENCE, WRITING_CANON } from "@ssot/govlab/shared/manifests/writing.canon.manifest.ts";
import { describe, expect, it } from "vitest";
import { REGISTER_HEADER } from "@ssot/govlab/shared/strings/writing.strings.ts";
import { canonMarkdown } from "@ssot/govlab/shared/formatters/writing.formatter.ts";

describe("canonMarkdown", () => {
    it("renders the header, the layer index, every rule and the precedence, ending on one newline", () => {
        const rendered = canonMarkdown(WRITING_CANON, REGISTER_HEADER, CANON_PRECEDENCE);
        expect(rendered.startsWith(REGISTER_HEADER[0] ?? "")).toBe(true);
        expect(rendered).toContain("## Layers");
        for (const rule of WRITING_CANON.flatMap((layer) => layer.rules)) {
            expect(rendered).toContain(`### ${rule.id}`);
        }
        expect(rendered.endsWith(`${CANON_PRECEDENCE}\n`)).toBe(true);
    });
});
