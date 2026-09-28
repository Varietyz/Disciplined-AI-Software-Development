import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { roleSectionsFrom } from "../inspectors/role.inspector.ts";
import { runRole } from "../runners/role.runner.ts";
import type { BranchFixture, BranchObservation } from "../types/fixture.types.ts";

const TEMPLATE = "probe-role.template.md";

const DOCUMENT = "probe-concern.z.role.md";

const CONTRACTED = [
    "---",
    "name: <subject>.<letter>",
    "type: ROLE",
    "letter: <the indexed letter>",
    "concern: <the one concern>",
    "---",
    "",
    "# HOW THIS TEMPLATE IS USED",
    "",
    "prose a raised document does not carry",
    "",
    "# Name",
    "",
    "<who this seat is>",
    "",
    "# Role",
    "",
    "<what this seat is for>",
    "",
    "## Failure modes",
    "",
    "<the shapes this seat exhibits>",
    "",
].join("\n");

const CONTRACTLESS = ["---", "name: <subject>.<letter>", "---", "", "prose with no declared section", ""].join("\n");

function raising(root: string, concern: string): BranchObservation {
    const absolute = resolve(root, DOCUMENT);
    const outcome = runRole({ absolute, template: resolve(root, TEMPLATE), letter: "Z", concern });

    if (!existsSync(absolute)) return { code: outcome.code, written: false, sections: 0, letter: false, usage: false };

    const raised = readFileSync(absolute, "utf8");
    const declared = roleSectionsFrom(readFileSync(resolve(root, TEMPLATE), "utf8"));

    return {
        code: outcome.code,
        written: true,
        sections: declared.filter((section) => raised.includes(section)).length,
        letter: raised.includes("letter: Z"),
        usage: raised.includes("HOW THIS TEMPLATE IS USED"),
    };
}

export const ROLE_BRANCH_FIXTURES: readonly BranchFixture[] = [
    {
        subject: "role.runner",
        branch: "a raise from a template declaring sections, which carries every one and none of its usage prose",
        seed: [{ path: TEMPLATE, text: CONTRACTED }],
        exercise: (root) => raising(root,"probe-concern"),
        expect: { code: 0, written: true, sections: 2, letter: true, usage: false },
    },
    {
        subject: "role.runner",
        branch: "a raise from a template declaring no section, which has no contract to raise from",
        seed: [{ path: TEMPLATE, text: CONTRACTLESS }],
        exercise: (root) => raising(root, "probe-concern"),
        expect: { code: 2, written: false, sections: 0, letter: false, usage: false },
    },
    {
        subject: "role.runner",
        branch: "a raise naming no concern, whose filename would carry the letter the citations resolve through",
        seed: [{ path: TEMPLATE, text: CONTRACTED }],
        exercise: (root) => raising(root,"   "),
        expect: { code: 2, written: false, sections: 0, letter: false, usage: false },
    },
];
