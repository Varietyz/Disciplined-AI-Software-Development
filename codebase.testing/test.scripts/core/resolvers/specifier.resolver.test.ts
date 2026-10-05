import {
    anchorSpecifier,
    relativeSpecifier,
    resolveSelfImport,
    selfImportTargets,
} from "@project/scripts/core/resolvers/specifier.resolver.ts";
import { describe, expect, it } from "vitest";
import { join } from "node:path";

const ZONE = "zone";
const KINDS = "kinds";
const NAME = "@fixture/member";
const ENTRY = "entry.ts";
const IMPORTER = `${ZONE}/a.ts`;

const MANIFEST = {
    exports: { "./*": "./*" },
    imports: { [`#${KINDS}/*`]: `./${KINDS}/*.ts`, [`#${ZONE}/*`]: `./${ZONE}/*.ts` },
    main: ENTRY,
    name: NAME,
};

describe("selfImportTargets and resolveSelfImport", () => {
    const targets = selfImportTargets(MANIFEST);

    it("maps each imports key to the container it targets", () => {
        expect([...targets]).toStrictEqual([
            [`#${KINDS}`, KINDS],
            [`#${ZONE}`, ZONE],
        ]);
    });

    it("rewrites a self import relative to the importing file, and leaves any other specifier alone", () => {
        expect(resolveSelfImport(targets, `#${KINDS}/base`, `${ZONE}/deep/b.ts`)).toBe(`../../${KINDS}/base.ts`);
        expect(resolveSelfImport(targets, `#${ZONE}/c`, IMPORTER)).toBe("./c.ts");
        expect(resolveSelfImport(targets, "#other/c", IMPORTER)).toBe("#other/c");
        expect(resolveSelfImport(targets, "node:fs", IMPORTER)).toBe("node:fs");
    });
});

describe("relativeSpecifier", () => {
    it("climbs only as far as the paths diverge", () => {
        expect(relativeSpecifier("", IMPORTER)).toBe(`./${IMPORTER}`);
        expect(relativeSpecifier(ZONE, IMPORTER)).toBe("./a.ts");
        expect(relativeSpecifier(`${ZONE}/x`, `${KINDS}/a.ts`)).toBe(`../../${KINDS}/a.ts`);
    });
});

describe("anchorSpecifier", () => {
    const root = join("member");
    const importer = join(root, ZONE, "a.ts");

    it("anchors a relative specifier at the member root and keeps one that climbs out of it", () => {
        expect(anchorSpecifier(root, MANIFEST, importer, "./b.ts")).toBe(`./${ZONE}/b.ts`);
        expect(anchorSpecifier(root, MANIFEST, join(root, "a.ts"), "../outside.ts")).toBe("../outside.ts");
    });

    it("rewrites the member's own package name through main and its export pattern", () => {
        expect(anchorSpecifier(root, MANIFEST, importer, NAME)).toBe(`./${ENTRY}`);
        expect(anchorSpecifier(root, MANIFEST, importer, `${NAME}/${ZONE}/b.ts`)).toBe(`./${ZONE}/b.ts`);
        expect(anchorSpecifier(root, MANIFEST, importer, "vite")).toBe("vite");
        expect(anchorSpecifier(root, { name: NAME }, importer, NAME)).toBe(NAME);
    });

    it("anchors a self import from a file inside the member, and keeps one it cannot resolve", () => {
        expect(anchorSpecifier(root, MANIFEST, join(root, "vite.config.ts"), `#${KINDS}/base`)).toBe(
            `./${KINDS}/base.ts`,
        );
        expect(anchorSpecifier(root, MANIFEST, importer, "#other/c")).toBe("#other/c");
        expect(anchorSpecifier(root, MANIFEST, join("elsewhere", "a.ts"), `#${KINDS}/base`)).toBe(`#${KINDS}/base`);
    });
});
