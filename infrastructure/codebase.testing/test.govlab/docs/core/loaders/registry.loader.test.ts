import { ACTIVITY_VERBS, DOC_CONCERNS } from "@govlab/docs/configuration/constants/concern.constants.ts";
import { EXTENSION_DIR, extensionDirs, loadUserRegistries } from "@govlab/docs/core/loaders/registry.loader.ts";
import { describe, expect, it } from "vitest";
import { homedir, tmpdir } from "node:os";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { DEFAULT_ROOT_PREFIX } from "@govlab/docs/configuration/constants/document.constants.ts";
import { DOC_FORMS } from "@govlab/docs/configuration/constants/form.constants.ts";
import { DOC_VERBS } from "@govlab/docs/configuration/constants/verb.constants.ts";
import { computeLocation } from "@govlab/docs/core/resolvers/location.resolver.ts";
import { join } from "node:path";
import { writeVerbatim } from "@govlab/canonical-write";

const BASE = { activityVerbs: ACTIVITY_VERBS, concerns: DOC_CONCERNS, forms: DOC_FORMS, refVerbs: DOC_VERBS };
const RUNBOOK_FORM =
    'export default { boundary: false, folder: "runbooks", id: "runbook", kind: "authored", mood: "directive", ownerAxis: "concern", tag: "runbook" };';
const OPERATIONS_CONCERN = 'export default { concern: "operations", verb: "operate" };';

const withFixture = async function withFixture(
    tree: Record<string, string>,
    run: (root: string) => Promise<void>,
): Promise<void> {
    const root = mkdtempSync(join(tmpdir(), "doclab-ext-"));
    try {
        for (const [rel, body] of Object.entries(tree)) {
            const full = join(root, EXTENSION_DIR, rel);
            mkdirSync(join(full, ".."), { recursive: true });
            writeVerbatim(full, body);
        }
        await run(root);
    } finally {
        rmSync(root, { force: true, recursive: true });
    }
};

describe("extensionDirs", () => {
    it("adds the home extension folder only when global extensions are allowed", () => {
        expect(extensionDirs("r", false)).toStrictEqual([join("r", EXTENSION_DIR)]);
        expect(extensionDirs("r", true)[0]).toBe(join(homedir(), EXTENSION_DIR));
    });
});

describe("loadUserRegistries", () => {
    it("merges a user form, concern and activity verb into fresh frozen registries that route", async () => {
        await withFixture(
            { "doc-concerns/operations.mjs": OPERATIONS_CONCERN, "doc-forms/runbook.mjs": RUNBOOK_FORM },
            async (root) => {
                const registries = await loadUserRegistries(root, BASE);
                expect(registries.forms["runbook"]?.folder).toBe("runbooks");
                expect(registries.activityVerbs["operations"]).toBe("operate");
                expect(Object.isFrozen(registries.forms) && Object.isFrozen(registries.concerns)).toBe(true);
                expect(Object.hasOwn(DOC_FORMS, "runbook")).toBe(false);
                const result = computeLocation({
                    concern: "operations",
                    form: "runbook",
                    name: "operate-deploy",
                    options: { rootPrefix: DEFAULT_ROOT_PREFIX },
                    registries: { concerns: registries.concerns, forms: registries.forms },
                });
                expect(result).toMatchObject({
                    ok: true,
                    path: `${DEFAULT_ROOT_PREFIX}runbooks/operate-deploy.runbook.md`,
                });
            },
        );
    });

    it("rejects a form with a colliding folder or a malformed shape, and keeps the base with no extensions", async () => {
        const collide =
            'export default { boundary: false, folder: "changelogs", id: "mine", kind: "authored", ownerAxis: "concern" };';
        await withFixture(
            { "doc-forms/broken.mjs": 'export default { id: "nope" };', "doc-forms/collide.mjs": collide },
            async (root) => {
                const registries = await loadUserRegistries(root, BASE);
                expect(Object.hasOwn(registries.forms, "mine")).toBe(false);
                expect(Object.hasOwn(registries.forms, "nope")).toBe(false);
            },
        );
        await withFixture({}, async (root) => {
            const registries = await loadUserRegistries(root, BASE);
            expect(Object.keys(registries.forms)).toHaveLength(Object.keys(DOC_FORMS).length);
        });
    });
});
