import {
    ANCHOR_SUBJECT,
    BUILD_CONFIG_FILES,
    BUILD_SCRIPT_ROOT,
    BUILD_SCRIPT_ROOT_SEGMENT,
    FOUNDATION_FOLDER,
    FOUNDATION_PREFIX,
    FOUNDATION_SUBJECT,
    GOVERNED_ROOT,
    GRAPH_PATH,
    LAYER_SUBJECT,
    LOCATION_SUBJECT,
    MEMBER_ROOT,
    PROJECT_ROOT,
    RULE_HOST,
    SCRIPT_ROOT,
    SCRIPT_ROOT_SEGMENT,
    SOURCE_EXTENSIONS,
    TAXONOMY_SUBJECT,
    TEST_ROOT,
    TEST_ROOT_SEGMENT,
    WORKSPACE_ROOT,
    basenameOf,
    collapsePath,
    containerPathOf,
    isGovernedFile,
    isInContainer,
    isSourceFile,
    labelOf,
    normalizePath,
    projectDirs,
    projectFiles,
} from "@ssot/govlab/shared/resolvers/anchor.resolver.ts";
import { describe, expect, it } from "vitest";
import { join, sep } from "node:path";
import { isLegalSubject } from "@ssot/govlab/shared/manifests/taxonomy.manifest.ts";
import { relativePath } from "@ssot/paths";

describe("normalizePath and basenameOf", () => {
    it("normalizes separators and takes the trailing segment", () => {
        const value = join("core", "registries", "probe.registry.ts");
        expect(normalizePath(value)).toBe(["core", "registries", "probe.registry.ts"].join("/"));
        expect(basenameOf(value)).toBe("probe.registry.ts");
    });

    it("returns the whole string when there is no separator", () => {
        expect(basenameOf("probe.ts")).toBe("probe.ts");
    });
});

describe("isSourceFile", () => {
    it("accepts every declared source extension, on either separator", () => {
        for (const ext of SOURCE_EXTENSIONS) {
            expect(isSourceFile(`core/registries/probe.registry${ext}`)).toBe(true);
            expect(isSourceFile(join("core", `probe${ext}`))).toBe(true);
        }
    });

    it("refuses the ecosystem-fixed config filenames, which no import graph reaches", () => {
        for (const name of ["package.json", "tsconfig.json", "_manifest.json", "README.md", "styles.css"]) {
            expect(isSourceFile(name)).toBe(false);
        }
    });
});

describe("collapsePath", () => {
    it("resolves a climb against the preceding segment", () => {
        expect(collapsePath(["a", "b", "..", "c.ts"].join("/"))).toBe(["a", "c.ts"].join("/"));
    });

    it("drops empty and current-directory segments", () => {
        expect(collapsePath(["a", ".", "", "b.ts"].join("/"))).toBe(["a", "b.ts"].join("/"));
    });

    it("collapses to nothing when every segment is climbed away", () => {
        expect(collapsePath(["a", ".."].join("/"))).toBe("");
    });
});

describe("labelOf", () => {
    it("strips the rule tag so the filename stem is the rule id", () => {
        expect(labelOf("closure-rule-shape.eslint.rule")).toBe("closure-rule-shape");
    });

    it("leaves a stem without the tag untouched", () => {
        expect(labelOf("rule.plugin")).toBe("rule.plugin");
    });
});

describe("the resolved anchors", () => {
    it("resolves every root through the paths SSOT rather than a literal", () => {
        expect(normalizePath(PROJECT_ROOT).endsWith(relativePath("app.root"))).toBe(true);
        expect(normalizePath(MEMBER_ROOT).endsWith(relativePath("app.member"))).toBe(true);
        expect(normalizePath(WORKSPACE_ROOT).length).toBeGreaterThan(0);
        expect(normalizePath(TEST_ROOT).includes(relativePath("codebase.testing"))).toBe(true);
        expect(normalizePath(SCRIPT_ROOT).includes(relativePath("project.scripts"))).toBe(true);
        expect(normalizePath(BUILD_SCRIPT_ROOT).endsWith(relativePath("app.build"))).toBe(true);
        expect(normalizePath(RULE_HOST).includes(relativePath("govlabHost.rules"))).toBe(true);
        expect(normalizePath(GRAPH_PATH).endsWith(".json")).toBe(true);
        expect(GOVERNED_ROOT).toBe(relativePath("app.member"));
    });

    it("exposes the test and script segments with separators, so a substring test cannot half-match", () => {
        expect(TEST_ROOT_SEGMENT.endsWith("/")).toBe(true);
        expect(SCRIPT_ROOT_SEGMENT.startsWith("/")).toBe(true);
        expect(BUILD_SCRIPT_ROOT_SEGMENT).toBe(`/${relativePath("app.build")}/`);
    });
});

describe("the foundation constants", () => {
    it("derives the folder and the type prefix from one declared subject", () => {
        expect(FOUNDATION_FOLDER).toBe(`/${FOUNDATION_SUBJECT}/`);
        expect(FOUNDATION_PREFIX).toBe(FOUNDATION_SUBJECT.slice(0, 1).toUpperCase() + FOUNDATION_SUBJECT.slice(1));
    });

    it("names the subjects the rules resolve their anchor files by, each a legal taxonomy subject", () => {
        for (const subject of [TAXONOMY_SUBJECT, LAYER_SUBJECT, ANCHOR_SUBJECT, LOCATION_SUBJECT]) {
            expect(isLegalSubject(subject)).toBe(true);
        }
    });
});

describe("BUILD_CONFIG_FILES", () => {
    it("names build configs generically rather than binding one bundler", () => {
        expect(BUILD_CONFIG_FILES.length).toBeGreaterThan(1);
        expect(BUILD_CONFIG_FILES.every((name) => name.endsWith(".config.ts"))).toBe(true);
    });
});

describe("isGovernedFile", () => {
    it("accepts a file inside the governed member family", () => {
        const inside = `${normalizePath(MEMBER_ROOT)}/core/registries/probe.registry.ts`;
        expect(isGovernedFile(inside)).toBe(true);
    });

    it("refuses a file outside it, which is how one guard scopes every local rule", () => {
        expect(isGovernedFile(`${normalizePath(WORKSPACE_ROOT)}/${relativePath("codebase.testing")}/index.ts`)).toBe(
            false,
        );
    });

    it("accepts every declared governed root, so the tier reaches each taxonomy jurisdiction", () => {
        expect(isGovernedFile(`${normalizePath(WORKSPACE_ROOT)}/${relativePath("app.deploy")}/package.json`)).toBe(
            true,
        );
        expect(isGovernedFile(`${normalizePath(WORKSPACE_ROOT)}/${relativePath("app.content")}/types/x.types.ts`)).toBe(
            true,
        );
    });

    it("accepts a platform-separated path too", () => {
        expect(isGovernedFile(`${normalizePath(MEMBER_ROOT).split("/").join(sep)}${sep}index.ts`)).toBe(true);
    });
});

describe("containerPathOf and isInContainer", () => {
    const typesFile = `${normalizePath(MEMBER_ROOT)}/types/probe.types.ts`;
    const coreFile = `${normalizePath(MEMBER_ROOT)}/core/registries/probe.registry.ts`;

    it("resolves a container of the file's own governed root and tests membership against it", () => {
        expect(containerPathOf(typesFile, "types")?.endsWith("/types/")).toBe(true);
        expect(isInContainer(typesFile, "types")).toBe(true);
        expect(isInContainer(coreFile, "types")).toBe(false);
    });

    it("answers null for a file outside every governed root or a container its root does not declare", () => {
        expect(containerPathOf("elsewhere/probe.ts", "types")).toBeNull();
        expect(containerPathOf(coreFile, "not-a-container")).toBeNull();
    });
});

describe("projectDirs and projectFiles", () => {
    it("enumerates every governed root's folders, each relative to the root's parent and ending in a separator", () => {
        const dirs = projectDirs();
        expect(dirs.length).toBeGreaterThan(0);
        expect(dirs.every((dir) => dir.endsWith("/"))).toBe(true);
        expect(dirs.some((dir) => dir.startsWith(`${relativePath("govlabHost")}/`))).toBe(true);
        expect(dirs.some((dir) => dir.startsWith(`${normalizePath(MEMBER_ROOT).split("/").pop() ?? ""}/`))).toBe(true);
    });

    it("enumerates every governed root's files, none of which is a directory entry", () => {
        const files = projectFiles();
        expect(files.length).toBeGreaterThan(0);
        expect(files.every((file) => !file.endsWith("/"))).toBe(true);
    });
});
