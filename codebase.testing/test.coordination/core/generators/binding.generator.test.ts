import { describe, it } from "vitest";
import { join, resolve } from "node:path";
import { mkdtempSync, readFileSync } from "node:fs";
import { renderBinding, writeBinding } from "coordination-surface/tools/core/generators/binding.generator.ts";
import { BINDING_PATH } from "coordination-surface/tools/core/constants/binding.constants.ts";
import assert from "node:assert/strict";
import { tmpdir } from "node:os";

const ROW_LEAD = "| `{";

describe("renderBinding", () => {
    it("renders every slot as a row, sorted within its section, followed by the derived census", () => {
        const rendered = renderBinding();
        assert.equal(rendered.includes("| `{project.root}` | RESOLVED |"), true);
        assert.equal(rendered.includes("## Resolution census"), true);
        const projectRows = rendered.split("\n").filter((line) => line.startsWith(`${ROW_LEAD}project.`));
        const names = projectRows.map((line) => line.slice(ROW_LEAD.length, line.indexOf("}")));
        assert.deepEqual(
            names,
            names.toSorted((left, right) => left.localeCompare(right, "en")),
        );
    });
});

describe("writeBinding", () => {
    it("writes the rendered binding inside the declared scope and refuses outside it", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-binding-"));
        assert.equal(writeBinding(root, "rendered\n"), null);
        assert.equal(readFileSync(resolve(root, BINDING_PATH), "utf8"), "rendered\n");
        assert.notEqual(writeBinding(root, "rendered\n", "somewhere/else"), null);
    });
});
