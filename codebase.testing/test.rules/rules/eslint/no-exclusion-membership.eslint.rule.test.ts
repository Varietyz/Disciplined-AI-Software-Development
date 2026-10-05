import {
    DERIVING_METHODS,
    MARKER_SOURCE_CALLEES,
    MARKER_SOURCE_NAMES,
    MEMBERSHIP_METHODS,
} from "@ssot/govlab/shared/manifests/exclusions.manifest.ts";
import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import { absolutePath } from "@ssot/paths";
import rule from "@ssot/govlab/rules/eslint/no-exclusion-membership.eslint.rule.ts";
import { sep } from "node:path";

const linter = new Linter();
const config = [
    {
        files: ["**/*.ts"],
        languageOptions: { ecmaVersion: 2025 as const, sourceType: "module" as const },
        plugins: { t: { rules: { r: rule } } },
        rules: { "t/r": "error" as const },
    },
];

const FILE = `${absolutePath("govlab.quality").split(sep).join("/")}/src/probe.ts`;
const MEMBERSHIP = ["membership"];

const idsFor = function idsFor(code: string): string[] {
    return linter
        .verify(code, config, FILE)
        .map((message) => message.messageId)
        .filter((id): id is string => typeof id === "string");
};

describe("no-exclusion-membership", () => {
    it("classifies the marker surface as data", () => {
        expect(MARKER_SOURCE_CALLEES.has("masterExcludeMarkers")).toBe(true);
        expect(MARKER_SOURCE_NAMES.has("MASTER_EXCLUDE_MARKERS")).toBe(true);
        expect(MEMBERSHIP_METHODS.has("has")).toBe(true);
        expect(DERIVING_METHODS.has("map")).toBe(true);
    });

    it("flags a set built from the markers and a lookup on it", () => {
        const code = "const SKIP = new Set(masterExcludeMarkers(config));\nSKIP.has(name);";
        expect(idsFor(code)).toStrictEqual(["markerSet", "membership"]);
    });

    it("flags a membership method called on the marker list directly", () => {
        expect(idsFor("MASTER_EXCLUDE_MARKERS.includes(name);")).toStrictEqual(MEMBERSHIP);
        expect(idsFor("masterExcludeMarkers(config).some((marker) => marker === name);")).toStrictEqual(MEMBERSHIP);
    });

    it("follows the markers through a spread, an await and a derived list", () => {
        expect(idsFor('const skip = [...MASTER_EXCLUDE_MARKERS, "extra"];\nskip.includes(name);')).toStrictEqual(
            MEMBERSHIP,
        );
        expect(idsFor("const held = await masterExcludeMarkers(config);\nheld.indexOf(name);")).toStrictEqual(
            MEMBERSHIP,
        );
        expect(idsFor("MASTER_EXCLUDE_MARKERS.map((marker) => marker === name).includes(true);")).toStrictEqual(
            MEMBERSHIP,
        );
    });

    it("accepts the markers passed as an argument, joined into a flag, or captured by a helper", () => {
        expect(idsFor("isExcludedPath(rel, MASTER_EXCLUDE_MARKERS);")).toStrictEqual([]);
        expect(idsFor('const flag = masterExcludeMarkers(config).join(",");')).toStrictEqual([]);
        const helper =
            "const skip = (rel) => isExcludedPath(rel, MASTER_EXCLUDE_MARKERS);\nconst kept = rows.filter(skip);";
        expect(idsFor(`${helper}\nkept.filter((row) => row.ok);`)).toStrictEqual([]);
    });

    it("ignores a membership test on an unrelated set", () => {
        expect(idsFor('const SEEN = new Set(["a"]);\nSEEN.has(name);')).toStrictEqual([]);
    });
});
