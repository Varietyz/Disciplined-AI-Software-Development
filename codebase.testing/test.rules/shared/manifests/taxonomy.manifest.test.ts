import { GOVERNED_ROOT, projectDirs, projectFiles } from "@ssot/govlab/shared/resolvers/anchor.resolver.ts";
import {
    MAX_DEPTH,
    concernForPath,
    concernSuffix,
    concernTags,
    containersFor,
    folderFor,
    governedRoots,
    isCompoundMarker,
    isConcern,
    isConcernFolder,
    isContainer,
    isDeclaredContainer,
    isDeclaredSubject,
    isDeclaredVariant,
    isEnforced,
    isForeignContainer,
    isGeneratedFolder,
    isIgnoredName,
    isImportedRoot,
    isLegalSubject,
    isMarkerFolder,
    isNameExempt,
    isNestedRoot,
    isSpecialContainer,
    layerFor,
    legalSubjects,
    markerFolderOf,
    placementOf,
    rootFor,
    splitterFor,
    tagForFolder,
    tagsForFolder,
    vocabularyFor,
} from "@ssot/govlab/shared/manifests/taxonomy.manifest.ts";
import type { Splitter, TaxonomySource } from "@ssot/govlab/types/taxonomy.types.ts";
import { concernFolders, containerPath, containerPaths } from "@ssot/govlab/shared/resolvers/container.resolver.ts";
import { createVocabulary, importedRootsOf } from "@ssot/govlab/shared/factories/vocabulary.factory.ts";
import { describe, expect, it } from "vitest";
import {
    filesWithConcern,
    hasConcern,
    isExempt,
    isKebab,
    isParsed,
    parseDialect,
    parseFilename,
    resolveFile,
} from "@ssot/govlab/shared/matchers/filename.matcher.ts";
import { folderPathError, roleAtDepth } from "@ssot/govlab/shared/matchers/folder.matcher.ts";
import { isWellFormedJoiner, slotWordOf, wordsOf } from "@ssot/govlab/shared/matchers/segment.matcher.ts";
import { imports } from "@ssot/govlab/shared/configs/taxonomy.config.ts";
import { matchesPattern } from "@ssot/govlab/shared/matchers/pattern.matcher.ts";
import { relativePath } from "@ssot/paths";

const IMPORTS: Readonly<Record<string, TaxonomySource>> = imports;

describe("the declared jurisdiction", () => {
    it("names at least one governed root, since no declaration means no enforcement", () => {
        expect(governedRoots().length).toBeGreaterThan(0);
        expect(governedRoots()).toContain(GOVERNED_ROOT);
    });

    it("lists the containers each root admits", () => {
        expect(containersFor(GOVERNED_ROOT).length).toBeGreaterThan(0);
        expect(containersFor("not/a/declared/root")).toStrictEqual([]);
    });

    it("resolves a file back to the root that governs it", () => {
        expect(rootFor(`${GOVERNED_ROOT}/core/registries/probe.registry.ts`)).toBe(GOVERNED_ROOT);
        expect(rootFor("elsewhere/probe.ts")).toBeUndefined();
    });

    it("enforces only where a root is declared", () => {
        expect(isEnforced(`${GOVERNED_ROOT}/core/registries/probe.registry.ts`)).toBe(true);
        expect(isEnforced("elsewhere/probe.ts")).toBe(false);
    });

    it("separates a declared container from an undeclared one", () => {
        const [container] = containersFor(GOVERNED_ROOT);
        expect(container === undefined ? true : isDeclaredContainer(GOVERNED_ROOT, container)).toBe(true);
        expect(isDeclaredContainer(GOVERNED_ROOT, "not-a-container")).toBe(false);
        expect(container === undefined ? true : isContainer(GOVERNED_ROOT, container)).toBe(true);
        expect(isContainer(GOVERNED_ROOT, "not-a-container")).toBe(false);
    });

    it("names the flat buckets, where the depth cap does not apply", () => {
        expect(isSpecialContainer(GOVERNED_ROOT, "types")).toBe(true);
        expect(isSpecialContainer(GOVERNED_ROOT, "core")).toBe(false);
    });
});

describe("the closed vocabularies", () => {
    it("admits a declared concern tag and refuses an undeclared word", () => {
        expect(isConcern("registry")).toBe(true);
        expect(isConcern("manager")).toBe(false);
    });

    it("treats every concern tag as a legal subject, which is what makes resolution positional", () => {
        expect(isLegalSubject("registry")).toBe(true);
        expect(isLegalSubject("base")).toBe(true);
        expect(isLegalSubject("manager")).toBe(false);
        expect(legalSubjects().length).toBeGreaterThan(concernTags().length);
    });

    it("maps a tag to its canonical folder and back", () => {
        expect(folderFor("registry")).toBe("registries");
        expect(tagForFolder("registries")).toBe("registry");
        expect(tagForFolder("not-a-folder")).toBeUndefined();
        expect(tagsForFolder("registries")).toStrictEqual(["registry"]);
        expect(tagsForFolder("assets")).toStrictEqual(["asset", "assets"]);
        expect(tagsForFolder("not-a-folder")).toStrictEqual([]);
        expect(folderFor("assets")).toBe("assets");
        expect(isConcernFolder("registries")).toBe(true);
        expect(isConcernFolder("registry")).toBe(false);
    });

    it("separates a declared subject from a concern tag standing in as one, and knows the variant set", () => {
        expect(isDeclaredSubject("base")).toBe(true);
        expect(isDeclaredSubject("registry")).toBe(false);
        expect(isDeclaredVariant("fifo")).toBe(true);
        expect(isDeclaredVariant("base")).toBe(false);
    });

    it("holds every slot to kebab case", () => {
        expect(isKebab("code-point")).toBe(true);
        expect(isKebab("CodePoint")).toBe(false);
        expect(isKebab("-code")).toBe(false);
    });

    it("places every concern on the layer spine", () => {
        expect(layerFor("registry")).toBe("infrastructure");
        expect(layerFor("model")).toBe("domain");
    });

    it("names the compound markers that make a file name-exempt", () => {
        expect(isCompoundMarker("test")).toBe(true);
        expect(isCompoundMarker("registry")).toBe(false);
    });
});

describe("parseFilename", () => {
    it("resolves subject and concern from their slots", () => {
        const parsed = parseFilename("base.registry.ts");
        expect(isParsed(parsed)).toBe(true);
        expect(isParsed(parsed) ? parsed.concern : "").toBe("registry");
    });

    it("marks a compound-marker filename exempt rather than unparsable", () => {
        expect(isExempt(parseFilename("base.registry.test.ts"))).toBe(true);
        expect(isNameExempt("base.registry.test.ts")).toBe(true);
    });

    it("refuses an undeclared word in a slot", () => {
        const parsed = parseFilename("base.manager.ts");
        expect(isParsed(parsed)).toBe(false);
        expect(isExempt(parsed)).toBe(false);
    });

    it("refuses a filename whose subject equals its concern", () => {
        expect(isParsed(parseFilename("registry.registry.ts"))).toBe(false);
    });
});

const slotsOf = function slotsOf(basename: string, splitter: string): string {
    const parsed = parseDialect(basename, splitter);
    return isParsed(parsed) ? `${parsed.subject}.${parsed.variant ?? "-"}.${parsed.concern}.${parsed.ext}` : "";
};

const splitter = function splitter(name: string): Splitter {
    const declared = vocabularyFor().splitters.get(name);
    if (declared === undefined) {
        throw new Error(name);
    }
    return declared;
};

describe("parseDialect", () => {
    it("resolves the same slots from every declared splitter's word boundaries", () => {
        expect(slotsOf("FormValidator.java", "pascal")).toBe("form.-.validator.java");
        expect(slotsOf("formValidator.ts", "camel")).toBe("form.-.validator.ts");
        expect(slotsOf("form_validator.py", "snake")).toBe("form.-.validator.py");
        expect(slotsOf("form-validator.rb", "kebab")).toBe("form.-.validator.rb");
        expect(slotsOf("form.validator.cfg", "dot")).toBe("form.-.validator.cfg");
    });

    it("reads the upper-case forms of the joined splitters", () => {
        expect(slotsOf("FORM_VALIDATOR.sql", "screaming-snake")).toBe("form.-.validator.sql");
        expect(slotsOf("FORM-VALIDATOR.cob", "screaming-kebab")).toBe("form.-.validator.cob");
        expect(slotsOf("FORM.VALIDATOR.cfg", "screaming-dot")).toBe("form.-.validator.cfg");
    });

    it("refuses a fused run with no boundary, in either letter case", () => {
        expect(isParsed(parseDialect("formvalidator.py", "snake"))).toBe(false);
        expect(isParsed(parseDialect("FORMVALIDATOR.sql", "screaming-snake"))).toBe(false);
        expect(wordsOf("formvalidator", splitter("snake"))).toStrictEqual(["formvalidator"]);
    });

    it("reads a declared variant between the subject and the concern", () => {
        expect(slotsOf("FormFragmentValidator.kt", "pascal")).toBe("form.fragment.validator.kt");
        expect(slotsOf("form_fragment_validator.py", "snake")).toBe("form.fragment.validator.py");
    });

    it("exempts a name whose last word is a compound marker", () => {
        expect(isExempt(parseDialect("FormValidatorTest.java", "pascal"))).toBe(true);
    });

    it("refuses an undeclared concern, a name in another case, and an unread case", () => {
        expect(isParsed(parseDialect("FormManager.java", "pascal"))).toBe(false);
        expect(isParsed(parseDialect("formValidator.java", "pascal"))).toBe(false);
        expect(isParsed(parseDialect("Form_Validator.py", "snake"))).toBe(false);
        expect(() => parseDialect("FormValidator.java", "screaming")).toThrow("no declared splitter");
    });

    it("joins a word run into the one kebab slot word the vocabulary declares", () => {
        const words = wordsOf("CodePoint", splitter("pascal")) ?? [];
        expect(slotWordOf(words)).toBe("code-point");
        expect(slotWordOf(["form"])).toBe("form");
    });

    it("keeps the dotted grammar for an extension no dialect binds, and reads a joiner of punctuation only", () => {
        expect(splitterFor("ts")).toBeNull();
        expect(isWellFormedJoiner("::")).toBe(true);
        expect(isWellFormedJoiner("x")).toBe(false);
    });
});

describe("folderPathError", () => {
    it("accepts container then concern", () => {
        expect(folderPathError(GOVERNED_ROOT, ["core", "registries"])).toBeUndefined();
    });

    it("refuses a repeated role", () => {
        expect(folderPathError(GOVERNED_ROOT, ["core", "registries", "caches"])).toBeDefined();
    });

    it("refuses nesting past the declared cap", () => {
        const tooDeep = ["core", "base", "registries", "extra"];
        expect(folderPathError(GOVERNED_ROOT, tooDeep)).toContain("cap");
    });

    it("exposes the cap and the role ladder it enforces", () => {
        expect(MAX_DEPTH).toBeGreaterThan(1);
        expect(roleAtDepth(GOVERNED_ROOT, "core", 1, -1)).toBeGreaterThanOrEqual(0);
    });

    it("accepts a marker folder at the concern position", () => {
        expect(folderPathError(GOVERNED_ROOT, ["core", "generated"])).toBeUndefined();
    });

    it("refuses a label that fills two depths of one path, even when each depth resolves a role", () => {
        expect(folderPathError(GOVERNED_ROOT, ["core", "core"])).toContain("appears twice");
        expect(folderPathError(GOVERNED_ROOT, ["core", "registries", "registries"])).toContain("appears twice");
    });
});

describe("marker folders", () => {
    it("binds a generated file to the folder its marker names", () => {
        expect(markerFolderOf("ontology.generated.ts")).toBe("generated");
        expect(markerFolderOf("base.registry.test.ts")).toBeUndefined();
        expect(markerFolderOf("generated.ts")).toBeUndefined();
    });

    it("recognizes the bound folder and refuses a concern folder", () => {
        expect(isMarkerFolder("generated")).toBe(true);
        expect(isMarkerFolder("registries")).toBe(false);
    });
});

describe("placementOf and concernForPath", () => {
    it("places a governed file and names the concern folder holding it", () => {
        const file = `${GOVERNED_ROOT}/core/registries/base.registry.ts`;
        expect(placementOf(file)).toBeDefined();
        expect(concernForPath(file)).toBe("registry");
    });

    it("returns nothing for a file outside every governed root", () => {
        expect(placementOf("elsewhere/probe.ts")).toBeUndefined();
    });
});

describe("concern helpers over a real file list", () => {
    it("builds a concern's filename suffix from its declared tag", () => {
        expect(concernSuffix("registry")).toBe(".registry.ts");
    });

    it("recognizes a filename carrying a concern", () => {
        expect(hasConcern("base.registry.ts", "registry")).toBe(true);
        expect(hasConcern("base.model.ts", "registry")).toBe(false);
    });

    it("selects the member's files carrying a concern and resolves one by subject", () => {
        const files = projectFiles();
        const registries = filesWithConcern("registry", files);
        expect(registries.length).toBeGreaterThan(0);
        expect(resolveFile("base", "registry", files).endsWith("base.registry.ts")).toBe(true);
    });

    it("discovers the real folders declared for a concern under the member", () => {
        const found = concernFolders("registry", projectDirs());
        expect(found.length).toBeGreaterThan(0);
        expect(found.every((dir) => dir.endsWith("registries/"))).toBe(true);
        expect(concernFolders("not-a-concern", projectDirs())).toStrictEqual([]);
    });

    it("composes a container path relative to the member, which is how rules match a path fragment", () => {
        const composed = containerPath("core", GOVERNED_ROOT);
        expect(composed.endsWith("/core/")).toBe(true);
        expect(containerPaths().length).toBeGreaterThanOrEqual(containersFor(GOVERNED_ROOT).length);
    });
});

describe("imported roots", () => {
    const BASE = relativePath("app.coordination");
    const TOOLS = `${BASE}/tools`;
    const PROVIDER = `${BASE}/.{provider}`;
    const MEMBER = IMPORTS[BASE];

    it("registers each key of an imported taxonomy as a governed root under its base, with the member folder itself for the dot key", () => {
        const roots = MEMBER === undefined ? new Map() : importedRootsOf(BASE, MEMBER);
        expect(roots.get(TOOLS)).toBe("tools");
        expect(roots.get(PROVIDER)).toBe(".{provider}");
        expect(roots.get(BASE)).toBe(".");
        expect(governedRoots()).toContain(TOOLS);
    });

    it("builds a vocabulary whose roles follow the folder grammar's depths and whose subjects include every concern tag", () => {
        const vocabulary = MEMBER === undefined ? null : createVocabulary(MEMBER);
        expect(vocabulary?.roles.rolesAtDepth).toStrictEqual([["container"], ["subject", "concern"], ["concern"]]);
        expect(vocabulary?.roles.terminalRole).toBe("concern");
        expect(vocabulary?.legalSubjects.has("runner")).toBe(true);
    });

    it("answers each root from its own vocabulary, and a root it does not know from the host's", () => {
        expect(vocabularyFor(TOOLS)).not.toBe(vocabularyFor(GOVERNED_ROOT));
        expect(vocabularyFor(rootFor("elsewhere/probe.ts"))).toBe(vocabularyFor(GOVERNED_ROOT));
        expect(vocabularyFor("not/a/declared/root")).toBe(vocabularyFor(GOVERNED_ROOT));
        expect(isImportedRoot(TOOLS)).toBe(true);
        expect(isImportedRoot(GOVERNED_ROOT)).toBe(false);
        expect(isConcern("briefing", TOOLS)).toBe(true);
        expect(isConcern("briefing")).toBe(false);
        expect(layerFor("strings", TOOLS)).toBe("infrastructure");
        expect(layerFor("strings")).toBe("product");
    });

    it("names the member's foreign containers and its nested roots", () => {
        expect(isForeignContainer(PROVIDER, "agents")).toBe(true);
        expect(isForeignContainer(PROVIDER, "skills")).toBe(false);
        expect(isNestedRoot(BASE, "tools")).toBe(true);
        expect(isNestedRoot(BASE, "config")).toBe(false);
    });

    it("parses a file name and checks a folder path against the imported root's grammar", () => {
        expect(isParsed(parseFilename("venue.briefing.ts", TOOLS))).toBe(true);
        expect(isParsed(parseFilename("venue.briefing.ts"))).toBe(false);
        expect(folderPathError(TOOLS, ["core", "runners"])).toBeUndefined();
        expect(folderPathError(TOOLS, ["core", "misplaced"])).toBeDefined();
    });
});

describe("isIgnoredName", () => {
    it("skips the names declared outside the taxonomy entirely", () => {
        expect(isIgnoredName("index.ts")).toBe(true);
        expect(isIgnoredName("base.registry.ts")).toBe(false);
    });

    it("recognizes a generation folder by its declared prefix and marker", () => {
        expect(isGeneratedFolder(relativePath("moduleInfo"))).toBe(true);
        expect(isGeneratedFolder("_.generated")).toBe(false);
        expect(isGeneratedFolder("code.info.generated")).toBe(false);
    });

    it("matches a pattern whose wildcard stands anywhere in the name", () => {
        expect(matchesPattern("index.ts", "index.ts")).toBe(true);
        expect(matchesPattern("*.generated.*", "rule-index.generated.ts")).toBe(true);
        expect(matchesPattern("a*b*c", "abc")).toBe(true);
        expect(matchesPattern("a*b*c", "acb")).toBe(false);
    });
});
