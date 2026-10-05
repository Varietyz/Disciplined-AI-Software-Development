import {
    conceptTeachers,
    linkTargetsOf,
    markdownSectionsOf,
    moduleSectionOf,
    nodeOf,
    nodePartsOf,
    sectionsOf,
    stringsOf,
    teachingNodes,
} from "@banes-lab/content/core/converters/section.converter.ts";
import { describe, expect, it } from "vitest";
import type { ContentGraph } from "@banes-lab/content/types/coverage.types.ts";

const GRAPH: ContentGraph = {
    page: "methodology",
    sections: {
        loop: { requires: [], teaches: ["loop"], traces: [] },
        stance: { narrative: true, requires: [], teaches: [], traces: [] },
    },
};

describe("nodeOf and nodePartsOf", () => {
    it("join a page and a section into one node and split it back", () => {
        const node = nodeOf("methodology", "loop");
        expect(nodePartsOf(node)).toStrictEqual({ page: "methodology", section: "loop" });
    });
});

describe("teachingNodes", () => {
    it("lists only the sections that teach a concept", () => {
        expect(teachingNodes([GRAPH])).toStrictEqual([nodeOf("methodology", "loop")]);
    });
});

describe("conceptTeachers", () => {
    it("maps each concept to every node that teaches it, in page and section order", () => {
        const other: ContentGraph = {
            page: "architecture",
            sections: { model: { requires: ["loop"], teaches: ["loop", "model"], traces: [] } },
        };
        const teachers = conceptTeachers([GRAPH, other]);
        expect(teachers.get("loop")).toStrictEqual([nodeOf("methodology", "loop"), nodeOf("architecture", "model")]);
        expect(teachers.get("model")).toStrictEqual([nodeOf("architecture", "model")]);
        expect(teachers.has("stance")).toBe(false);
    });
});

describe("stringsOf", () => {
    it("collects every string in a nested value, and skips the records the caller names", () => {
        const value = { a: "one", b: [{ c: "two" }, 3], panel: { kind: "code", text: "three" } };
        expect(stringsOf(value)).toStrictEqual(["one", "two", "code", "three"]);
        expect(stringsOf(value, (record) => record["kind"] === "code")).toStrictEqual(["one", "two"]);
    });
});

const TABBED = {
    tabs: [
        {
            id: "start",
            intro: "Read [the loop](/disciplined-methodology#loop) first.",
            sections: [
                {
                    id: "loop",
                    intro: "See [a check](/disciplined-methodology/build#check) and [a check](/disciplined-methodology/build#check).",
                },
                { id: "stance", intro: "No links here." },
            ],
        },
    ],
};

describe("linkTargetsOf", () => {
    it("reads every Markdown link target in order", () => {
        expect(linkTargetsOf("[a](/x) and [b](/y#z)")).toStrictEqual(["/x", "/y#z"]);
    });

    it("stops at a link that never closes", () => {
        expect(linkTargetsOf("[a](/x) then [b](/y")).toStrictEqual(["/x"]);
    });
});

describe("sectionsOf", () => {
    it("splits every identified section out of the page body, keyed by page and section id", () => {
        const sections = sectionsOf("disciplined-methodology", TABBED);
        expect(sections.map((section) => section.key)).toStrictEqual([
            "disciplined-methodology",
            "disciplined-methodology#loop",
            "disciplined-methodology#stance",
        ]);
        expect(sections[0]?.links).toStrictEqual(["/disciplined-methodology#loop"]);
        expect(sections[1]?.links).toStrictEqual(["/disciplined-methodology/build#check"]);
        expect(sections[2]?.links).toStrictEqual([]);
    });

    it("changes a section's fingerprint when its text changes, and only that section's", () => {
        const before = sectionsOf("page", TABBED);
        const edited = structuredClone(TABBED);
        const stance = edited.tabs[0]?.sections[1];
        if (stance !== undefined) {
            stance.intro = "Still no links here.";
        }
        const after = sectionsOf("page", edited);
        expect(after[0]?.fingerprint).toBe(before[0]?.fingerprint);
        expect(after[1]?.fingerprint).toBe(before[1]?.fingerprint);
        expect(after[2]?.fingerprint).not.toBe(before[2]?.fingerprint);
    });

    it("leaves numbers out of the fingerprint, so a build count never unsigns a page", () => {
        const one = sectionsOf("home", { stats: [{ label: "rules", value: 64 }] });
        const two = sectionsOf("home", { stats: [{ label: "rules", value: 65 }] });
        expect(one[0]?.fingerprint).toBe(two[0]?.fingerprint);
    });

    it("keys a page without sections as one section named by the page", () => {
        expect(sectionsOf("home", { lead: "Hello." }).map((section) => section.key)).toStrictEqual(["home"]);
    });
});

const README = "# package\n\nLead.\n\n## Purpose\n\nOne.\n\n## Install\n\nTwo.";

describe("markdownSectionsOf", () => {
    it("keys the lead and each second-level section by file and heading", () => {
        expect(markdownSectionsOf("pkg", "README.md", README).map((section) => section.key)).toStrictEqual([
            "pkg#README.md",
            "pkg#README.md#Purpose",
            "pkg#README.md#Install",
        ]);
    });

    it("changes only the fingerprint of the section whose text changed", () => {
        const before = markdownSectionsOf("pkg", "README.md", README);
        const after = markdownSectionsOf("pkg", "README.md", README.replace("Two.", "Three."));
        expect(after[0]?.fingerprint).toBe(before[0]?.fingerprint);
        expect(after[1]?.fingerprint).toBe(before[1]?.fingerprint);
        expect(after[2]?.fingerprint).not.toBe(before[2]?.fingerprint);
    });
});

describe("moduleSectionOf", () => {
    it("keys a module by its path and fingerprints its literals", () => {
        const one = moduleSectionOf("pkg", "tools/a.strings.ts", ["Posted.", "Refused."]);
        expect(one.key).toBe("pkg#tools/a.strings.ts");
        expect(one.page).toBe("pkg");
        expect(moduleSectionOf("pkg", "tools/a.strings.ts", ["Posted."]).fingerprint).not.toBe(one.fingerprint);
    });
});
