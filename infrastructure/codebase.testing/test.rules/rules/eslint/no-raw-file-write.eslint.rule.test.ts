import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import { absolutePath } from "@ssot/paths";
import { sep } from "node:path";
import wrapper from "@ssot/govlab/rules/eslint/no-raw-file-write.eslint.rule.ts";

const rule = wrapper.plugins["govlab-write"].rules["no-raw-file-write"];

const OWNER = "text.persistence.ts";
const WRITERS = ["writeCanonicalJson", "writeVerbatim"];

const linter = new Linter();
const config: Linter.Config[] = [
    {
        files: ["**/*.ts"],
        languageOptions: { ecmaVersion: 2025, sourceType: "module" },
        plugins: { t: { rules: { r: rule } } },
        rules: { "t/r": ["error", { modules: [OWNER], writers: WRITERS }] },
    },
];

const MEMBER = absolutePath("app.member").split(sep).join("/");
const SRC = `${MEMBER}/core/registries/probe.registry.ts`;
const OWNER_SRC = `${MEMBER}/core/persistence/${OWNER}`;

const idsFor = function idsFor(code: string, filename: string = SRC): string[] {
    return linter
        .verify(code, config, filename)
        .map((message) => message.messageId)
        .filter((id): id is string => typeof id === "string");
};

const EPHEMERAL_ROOT = `const dir = mkdtempSync(join(tmpdir(), "probe-"));\n`;

describe("the raw file-write primitive", () => {
    it("reports a raw write outside the owner module", () => {
        expect(idsFor(`writeFileSync("doc-arch/out.json", JSON.stringify(data, null, 4));`)).toContain("bypass");
    });

    it("reports a helper that forwards its caller's target and content", () => {
        const helper = `export const save = (target, content) => { writeFileSync(target, content); };`;
        expect(idsFor(helper)).toEqual(["bypass"]);
    });

    it("leaves a raw write to a self-governed member that names its own write gate", () => {
        const governed = `${absolutePath("app.coordination").split(sep).join("/")}/tools/core/runners/probe.runner.ts`;
        expect(idsFor(`writeFileSync(target, written, "utf8");`, governed)).toEqual([]);
    });

    it("stays quiet on the primitive inside the owner module", () => {
        expect(
            idsFor(`export const save = (target, content) => { writeFileSync(target, content); };`, OWNER_SRC),
        ).toEqual([]);
    });
});

describe("the owner's writers", () => {
    it("reports a formatter-supported output whose filename carries no generated marker", () => {
        expect(idsFor(`await writeCanonicalJson("doc-arch/out.json", data);`)).toEqual(["marker"]);
    });

    it("stays quiet on a marked output", () => {
        expect(idsFor(`await writeCanonicalJson("doc-arch/out.generated.json", data);`)).toEqual([]);
    });

    it("stays quiet on a call that no declared writer names", () => {
        expect(idsFor(`await writeGeneratedMarkdown("doc-arch/out.md", text);`)).toEqual([]);
    });
});

describe("ephemeral output", () => {
    it("stays quiet on a raw write whose target roots at an ephemeral directory", () => {
        expect(idsFor(`${EPHEMERAL_ROOT}writeFileSync(join(dir, "out.json"), JSON.stringify(data, null, 4));`)).toEqual(
            [],
        );
    });

    it("follows the ephemeral root through an intermediate directory binding", () => {
        const nested = `${EPHEMERAL_ROOT}const inner = join(dir, "nested");\n`;
        expect(idsFor(`${nested}writeFileSync(join(inner, "out.json"), body);`)).toEqual([]);
    });

    it("follows the ephemeral root through a later assignment", () => {
        const assigned = `let dir;\nsetup(() => { dir = mkdtempSync(join(tmpdir(), "probe-")); });\n`;
        expect(idsFor(`${assigned}writeFileSync(join(dir, "out.json"), body);`)).toEqual([]);
    });

    it("still reports a committed write in a file that also uses an ephemeral directory", () => {
        expect(idsFor(`${EPHEMERAL_ROOT}writeFileSync("doc-arch/out.json", body);`)).toContain("bypass");
    });
});

describe("serialized JSON", () => {
    it("reports an indent other than four", () => {
        expect(idsFor(`const text = JSON.stringify(data, null, 2);`)).toEqual(["spacing"]);
    });
});
