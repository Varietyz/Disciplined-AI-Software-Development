import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { surfacePath } from "../../../config/surface.config.ts";
import { runSurfaceRaise } from "../runners/surface.runner.ts";
import type { BranchFixture, BranchObservation } from "../types/fixture.types.ts";

const TEMPLATE = [
    "# a probe template",
    "",
    "═══ CONTRACT (permanent) ═══",
    "",
    "the clause every raised surface carries",
    "",
    "═══ MODEL ═══",
    "",
    "**A surface raised from this template carries no statement until its subject is understood.**",
    "",
].join("\n");

const NO_BLOCK = ["# a probe template", "", "prose with no permanent block", ""].join("\n");

function raising(root: string, subject: string, rehearse = false): BranchObservation {
    const outcome = runSurfaceRaise({
        repoRoot: root,
        templateSlot: "model_template",
        rootSlot: "models",
        subject,
        concern: "model",
        rehearse,
    });

    const target = resolve(root, `${surfacePath("models")}/${subject.trim()}.model.md`);
    const raised = existsSync(target) ? readFileSync(target, "utf8") : "";

    return {
        code: outcome.code,
        carries: raised.includes("the clause every raised surface carries"),
        seeded: raised.includes("carries no statement until its subject"),
    };
}

export const SURFACE_BRANCH_FIXTURES: readonly BranchFixture[] = [
    {
        subject: "surface.runner",
        branch: "a raise carrying the permanent blocks and stopping where the template addresses its own reader",
        seed: [{ path: surfacePath("model_template"), text: TEMPLATE }],
        exercise: (root) => raising(root, "base"),
        expect: { code: 0, carries: true, seeded: false },
    },
    {
        subject: "surface.runner",
        branch: "a REHEARSED raise, which runs every refusal and writes NOTHING — the worst shape a preview can take is one that acts, because the invocation a party chooses for safety becomes the one that acts unannounced and leaves an artifact reading as somebody's deliberate work",
        seed: [{ path: surfacePath("model_template"), text: TEMPLATE }],
        exercise: (root) => raising(root, "base", true),
        expect: { code: 0, carries: false, seeded: false },
    },
    {
        subject: "surface.runner",
        branch: "a template whose header addresses the RAISER, which the raise drops — the permanent blocks are what an instance carries and a copy-me line is an instruction to whoever raises it, so carrying it lands a standing artifact telling its reader to create the artifact they are reading",
        seed: [{ path: surfacePath("model_template"), text: TEMPLATE }],
        exercise: (root) => {
            raising(root, "marker");
            const held = readFileSync(resolve(root, `${surfacePath("models")}/marker.model.md`), "utf8");
            return { opensAtBanner: held.trimStart().startsWith("═"), carriesHeader: held.includes("a probe template") };
        },
        expect: { opensAtBanner: true, carriesHeader: false },
    },
    {
        subject: "surface.runner",
        branch: "a template declaring no permanent block, whose raise would carry no contract at all",
        seed: [{ path: surfacePath("model_template"), text: NO_BLOCK }],
        exercise: (root) => raising(root, "base"),
        expect: { code: 2, carries: false, seeded: false },
    },
    {
        subject: "surface.runner",
        branch: "a raise naming a subject the taxonomy does not declare, which the form accepted and the naming walk then failed on its first run — BORN NON-CONFORMANT by the one mechanism that exists to make a surface conformant at creation, with the caller told the raise succeeded and the cost landing on whoever next runs the whole scope",
        seed: [{ path: surfacePath("model_template"), text: TEMPLATE }],
        exercise: (root) => raising(root, "a-subject-nobody-declared"),
        expect: { code: 2, carries: false, seeded: false },
    },
    {
        subject: "surface.runner",
        branch: "a raise naming no subject, which no citation could ever resolve through",
        seed: [{ path: surfacePath("model_template"), text: TEMPLATE }],
        exercise: (root) => raising(root, "   "),
        expect: { code: 2, carries: false, seeded: false },
    },
];
