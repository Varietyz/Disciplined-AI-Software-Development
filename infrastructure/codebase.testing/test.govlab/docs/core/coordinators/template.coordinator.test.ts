import { ACTIVITY_VERBS, DOC_CONCERNS } from "@govlab/docs/configuration/constants/concern.constants.ts";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { DOC_FORMS } from "@govlab/docs/configuration/constants/form.constants.ts";
import { DOC_VERBS } from "@govlab/docs/configuration/constants/verb.constants.ts";
import { captureOutput } from "./output.fixture.ts";
import { join } from "node:path";
import { runNew } from "@govlab/docs/core/coordinators/template.coordinator.ts";
import { tmpdir } from "node:os";

const root = mkdtempSync(join(tmpdir(), "doc-new-"));
const CONTEXT = {
    locationOptions: { rootPrefix: "docs/" },
    registries: { concerns: DOC_CONCERNS, forms: DOC_FORMS, owners: ["govlab"] },
    root,
    userReg: { activityVerbs: ACTIVITY_VERBS, concerns: DOC_CONCERNS, forms: DOC_FORMS, refVerbs: DOC_VERBS },
};
const ARGS = {
    concern: "scaling",
    form: "guide",
    member: "govlab",
    name: "",
    status: "",
    subject: "thing",
    summary: "",
};

afterEach(() => {
    vi.restoreAllMocks();
});

afterAll(() => {
    rmSync(root, { force: true, recursive: true });
});

describe("runNew", () => {
    it("scaffolds a directive document at its computed path and refuses to overwrite it", () => {
        const output = captureOutput();
        runNew(CONTEXT, ARGS);
        expect(existsSync(join(root, "docs", "guides", "scale-thing.govlab.guide.md"))).toBe(true);
        expect(output.out).toStrictEqual(["✓ docs:new — created docs/guides/scale-thing.govlab.guide.md\n"]);
        expect(() => {
            runNew(CONTEXT, ARGS);
        }).toThrow("already exists");
    });

    it("refuses an unknown form, a missing subject, a non-activity concern and an unplaceable member", () => {
        expect(() => {
            runNew(CONTEXT, { ...ARGS, form: "memo" });
        }).toThrow("unknown form");
        expect(() => {
            runNew(CONTEXT, { ...ARGS, subject: "" });
        }).toThrow("provide --subject");
        expect(() => {
            runNew(CONTEXT, { ...ARGS, concern: "quality" });
        }).toThrow("must be an activity");
        expect(() => {
            runNew(CONTEXT, { ...ARGS, member: "ghost", subject: "other" });
        }).toThrow("--member");
    });
});
