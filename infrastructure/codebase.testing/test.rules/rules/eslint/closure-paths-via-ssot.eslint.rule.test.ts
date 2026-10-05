import { ROOT, absolutePath } from "@ssot/paths";
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { Linter } from "eslint";
import { excludeMatcher } from "@govlab/quality/config";
import path from "node:path";
import rule from "@ssot/govlab/rules/eslint/closure-paths-via-ssot.eslint.rule.ts";
import tsParser from "@typescript-eslint/parser";

const isExcluded = await excludeMatcher(process.cwd());

const linter = new Linter();
const config = [
    {
        files: ["**/*.ts"],
        languageOptions: { ecmaVersion: 2025 as const, sourceType: "module" as const },
        plugins: { t: { rules: { r: rule } } },
        rules: { "t/r": "error" as const },
    },
];
const workspaceConfig = [
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: { ecmaVersion: 2025 as const, sourceType: "module" as const },
        },
        plugins: { t: { rules: { r: rule } } },
        rules: { "t/r": "error" as const },
    },
];

const FILE = `${absolutePath("govlab.quality").split(path.sep).join("/")}/src/probe.ts`;

const idsFor = function idsFor(code: string, file = FILE): string[] {
    return linter
        .verify(code, config, file)
        .map((message) => message.messageId)
        .filter((id): id is string => typeof id === "string");
};

const walk = function walk(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        if (isExcluded(full)) {
            return [];
        }
        if (entry.isDirectory()) {
            return walk(full);
        }
        return entry.name.endsWith(".ts") ? [full] : [];
    });
};

const messagesFor = function messagesFor(file: string): ReturnType<Linter["verify"]> {
    try {
        return linter.verify(readFileSync(file, "utf8"), workspaceConfig, file.split(path.sep).join("/"));
    } catch {
        return [];
    }
};

const workspaceFindings = function workspaceFindings(): string[] {
    return walk(ROOT).flatMap((file) => {
        const rel = path.relative(ROOT, file).split(path.sep).join("/");
        return messagesFor(file)
            .filter((message) => typeof message.messageId === "string")
            .map((message) => `${rel}:${String(message.line)} [${String(message.messageId)}]`);
    });
};

describe("hardcoded workspace locations", () => {
    it("flags a location wherever it is spelled, not only in a path call", () => {
        expect(idsFor('const dir = "govlab.root/govlab.quality";')).toContain("hardcodedLocation");
        expect(idsFor('function f(dir = "govlab.root/govlab.quality") { return dir; }')).toContain("hardcodedLocation");
    });

    it("flags a location assembled from segments, arrays or concatenation", () => {
        const head = 'import { join } from "node:path";\nconst ROOT = "";\n';
        expect(idsFor(`${head}const P = join(ROOT, ".govlab", "rules", "eslint");`)).toContain("segmentedLocation");
        expect(idsFor(`${head}const P = [".govlab", "rules", "eslint"].join("/");`)).toContain("segmentedLocation");
        expect(idsFor(`${head}const P = ".govlab" + "/rules/eslint";`)).toContain("hardcodedLocation");
    });

    it("flags a location a template assembles from constant holes", () => {
        const code = `const HOST = ".govlab";\nconst LEAF = "eslint";\nconst P = \`\${HOST}/rules/\${LEAF}\`;`;
        expect(idsFor(code).some((id) => id === "hardcodedLocation" || id === "segmentedLocation")).toBe(true);
    });

    it("does not flag the argument of an SSOT lookup", () => {
        const code = 'import { relativePath } from "@ssot/paths";\nconst P = relativePath("govlab.root");';
        expect(idsFor(code)).toEqual([]);
    });

    it("does not flag prose that names a location", () => {
        expect(idsFor('const meta = { message: "govlab.root/govlab.quality is governed" };')).toEqual([]);
    });
});

describe("hand-composed keys", () => {
    const head = 'import { relativePath } from "@ssot/paths";\n';

    it("flags composing a location the SSOT already declares", () => {
        expect(idsFor(`${head}const SRC = \`\${relativePath("govlab.root")}/govlab.quality\`;`)).toContain(
            "composedKey",
        );
    });

    it("allows composing a tail the SSOT does not declare", () => {
        expect(idsFor(`${head}const BIN = \`\${relativePath("govlab.quality")}/bin\`;`)).toEqual([]);
    });
});

describe("unanchored paths", () => {
    it("flags a path-shaped string that names a location from nothing", () => {
        expect(idsFor('const dir = "core/producers/eslint.producer.ts";')).toContain("unanchoredPath");
        expect(idsFor('const w = "content-fingerprint/core/stores";')).toContain("unanchoredPath");
    });

    it("allows a tail anchored to an SSOT call", () => {
        const code = [
            'import { relativePath } from "@ssot/paths";',
            `const BIN = \`\${relativePath("govlab.quality")}/bin\`;`,
        ].join("\n");
        expect(idsFor(code)).toEqual([]);
    });

    it("allows a path passed alongside an SSOT call", () => {
        const code = [
            'import path from "node:path";',
            'import { relativePath } from "@ssot/paths";',
            'const P = path.join(relativePath("govlab.quality"), "core/producers/catalog");',
        ].join("\n");
        expect(idsFor(code)).toEqual([]);
    });

    it("anchors a tail through the paths config a self-governed member declares, and through no other module", () => {
        const file = `${absolutePath("app.coordination").split(path.sep).join("/")}/tools/core/steps/probe.ts`;
        const through = (source: string): string[] =>
            idsFor(
                [
                    `import { packagePath } from "${source}";`,
                    'export const PLAN = packagePath("config/agenda.config.ts");',
                ].join("\n"),
                file,
            );
        expect(through("../../../config/surface.config.ts")).toEqual([]);
        expect(through("../constants/binding.constants.ts")).toContain("unanchoredPath");
    });

    it("leaves single-segment values, urls and protocol specifiers alone", () => {
        expect(idsFor('const a = "catalog";')).toEqual([]);
        expect(idsFor('const b = "https://example.com/x";')).toEqual([]);
        expect(idsFor('const c = "application/json";')).toEqual([]);
        expect(idsFor('const d = "a sentence with / inside";')).toEqual([]);
    });

    it("leaves a system path alone, because the workspace owns no key for it", () => {
        expect(idsFor('const shell = "/bin/sh";')).toEqual([]);
        expect(idsFor('const dev = "/dev/null";')).toEqual([]);
    });

    it("leaves a wildcard-only glob alone but keeps a glob rooted at a real directory", () => {
        expect(idsFor('const g = "**/*.{ts,mts}";')).toEqual([]);
        expect(idsFor('const h = "**/*.ts";')).toEqual([]);
        expect(idsFor('const i = "core/steps/**/*.ts";')).toContain("unanchoredPath");
    });
});

describe("import.meta targets", () => {
    it("flags a file-relative path that resolves to nothing on disk", () => {
        const code = 'import { resolve } from "node:path";\nconst BIN = resolve(import.meta.dirname, "..", "nope");';
        expect(idsFor(code)).toContain("metaMissing");
    });

    it("does not report a path the same file creates", () => {
        const code = [
            'import { resolve } from "node:path";',
            'import { mkdirSync } from "node:fs";',
            'const CERT_DIR = resolve(import.meta.dirname, ".dev-cert");',
            "mkdirSync(CERT_DIR, { recursive: true });",
        ].join("\n");
        expect(idsFor(code)).not.toContain("metaMissing");
    });

    it("does not treat a function return as this file's directory", () => {
        const code = [
            'import path from "node:path";',
            "const faceDataDir = (url: string): string => url;",
            "const dir = faceDataDir(import.meta.url);",
            'const keywords = path.join(dir, "keywords.json");',
        ].join("\n");
        expect(idsFor(code)).not.toContain("metaMissing");
    });
});

describe("the workspace names no location outside the paths SSOT", () => {
    it("reports no hardcoded, segmented, composed or unanchored path", () => {
        expect(workspaceFindings()).toEqual([]);
    }, 180_000);
});
