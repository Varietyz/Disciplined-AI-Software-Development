import { describe, expect, it } from "vitest";
import { DOC_FORMS } from "@govlab/docs/configuration/constants/form.constants.ts";
import { defined } from "../analyzers/program.fixture.ts";
import { renderTemplate } from "@govlab/docs/core/formatters/template.formatter.ts";

const base = { concern: "scaling", name: "scale-docs", status: "planned", summary: "One line." };

describe("renderTemplate", () => {
    it("scaffolds a concern-owned document with its concern and a module-owned one without", () => {
        const guide = renderTemplate({ ...base, def: defined(DOC_FORMS["guide"], "guide"), form: "guide" });
        expect(guide.split("\n").slice(0, 9)).toStrictEqual([
            "---",
            "type: guide",
            "name: scale-docs",
            "summary: One line.",
            "concern: scaling",
            "status: planned",
            "---",
            "",
            "# Scale Docs",
        ]);
        const changelog = renderTemplate({
            ...base,
            def: defined(DOC_FORMS["changelog"], "changelog"),
            form: "changelog",
        });
        expect(changelog).not.toContain("concern:");
        expect(changelog).toContain("Newest entries first.");
    });
});
