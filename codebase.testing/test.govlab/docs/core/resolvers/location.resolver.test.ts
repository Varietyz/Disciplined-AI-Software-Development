import { computeLocation, declaredDocLocation } from "@govlab/docs/core/resolvers/location.resolver.ts";
import { describe, expect, it } from "vitest";
import { DEFAULT_ROOT_PREFIX } from "@govlab/docs/configuration/constants/document.constants.ts";
import { DOC_FORMS } from "@govlab/docs/configuration/constants/form.constants.ts";
import type { LocationResult } from "@govlab/docs/types/location.types.ts";
import { relativePath } from "@ssot/paths";

const CONCERNS = ["architecture", "quality", "security", "frontend"];
const registries = { concerns: CONCERNS, forms: DOC_FORMS };

const reasonOf = function reasonOf(result: LocationResult): string {
    return result.ok ? "" : result.reason;
};

const pathOf = function pathOf(result: LocationResult): string {
    return result.ok ? result.path : "";
};

describe("computeLocation", () => {
    it("routes a concern-owned form flat under its form folder, with the concern in the filename tag", () => {
        const result = computeLocation({ concern: "security", form: "plan", name: "harden-auth", registries });
        expect(result).toStrictEqual({ ok: true, path: `${DEFAULT_ROOT_PREFIX}plans/harden-auth.plan.md` });
        expect(DEFAULT_ROOT_PREFIX).toBe(`${relativePath("docArch")}/`);
    });

    it("routes every concern-owned form for a valid concern", () => {
        const concernForms = Object.entries(DOC_FORMS).filter(
            ([, def]) => !def.boundary && def.ownerAxis === "concern",
        );
        for (const [id, def] of concernForms) {
            expect(pathOf(computeLocation({ concern: "quality", form: id, name: "x", registries }))).toBe(
                `${DEFAULT_ROOT_PREFIX}${def.folder}/x.${def.tag ?? ""}.md`,
            );
        }
    });

    it("routes a module-owned form flat by its module and refuses a concern on it", () => {
        expect(pathOf(computeLocation({ concern: "", form: "changelog", name: "govlab-sync", registries }))).toBe(
            `${DEFAULT_ROOT_PREFIX}changelogs/govlab-sync.md`,
        );
        expect(
            reasonOf(computeLocation({ concern: "security", form: "changelog", name: "govlab-sync", registries })),
        ).toBe("axis-contradiction");
    });

    it("fails an unknown form, an unknown concern and a missing concern with their reasons", () => {
        expect(reasonOf(computeLocation({ concern: "quality", form: "blueprint", name: "x", registries }))).toBe(
            "unknown-form",
        );
        expect(reasonOf(computeLocation({ concern: "gain", form: "plan", name: "x", registries }))).toBe(
            "unknown-concern",
        );
        expect(reasonOf(computeLocation({ concern: "", form: "design", name: "x", registries }))).toBe(
            "missing-concern",
        );
    });

    it("routes neither boundary nor generated forms, and refuses a bad name", () => {
        expect(reasonOf(computeLocation({ concern: "", form: "readme", name: "x", registries }))).toBe("boundary-form");
        const generated = {
            concerns: CONCERNS,
            forms: {
                gen: {
                    boundary: false,
                    folder: "g",
                    id: "gen",
                    kind: "generated" as const,
                    ownerAxis: "none" as const,
                },
            },
        };
        expect(reasonOf(computeLocation({ concern: "", form: "gen", name: "x", registries: generated }))).toBe(
            "not-authored",
        );
        for (const name of ["sub/dir", "already.md", ""]) {
            expect(reasonOf(computeLocation({ concern: "quality", form: "plan", name, registries }))).toBe("bad-name");
        }
    });

    it("takes the root prefix and the owner resolver as options", () => {
        const options = { rootPrefix: "docs/" };
        expect(pathOf(computeLocation({ concern: "quality", form: "plan", name: "x", options, registries }))).toBe(
            "docs/plans/x.plan.md",
        );
        const owned = computeLocation({
            concern: "",
            form: "changelog",
            name: "sync",
            options: { resolveOwner: (name) => `govlab-${name}` },
            registries,
        });
        expect(pathOf(owned)).toBe(`${DEFAULT_ROOT_PREFIX}changelogs/govlab-sync.md`);
    });
});

describe("declaredDocLocation", () => {
    it("returns the routed path of a declared document and throws on one that cannot route", () => {
        const doc = { body: [], concern: "quality", name: "x", summary: "s", type: "plan" };
        expect(declaredDocLocation(doc, registries, {})).toBe(`${DEFAULT_ROOT_PREFIX}plans/x.plan.md`);
        expect(() => declaredDocLocation({ ...doc, type: "blueprint" }, registries, {})).toThrow("unknown-form");
    });
});
