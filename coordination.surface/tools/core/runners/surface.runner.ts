import {
    SUBJECT_MISSING,
    contractBlockMissing,
    subjectUndeclared,
    surfaceExists,
    surfaceRaised,
    surfaceRehearsed,
    templateFileMissing,
    templateSeedsNothing,
} from "../strings/surface.strings.ts";
import { existsSync, readFileSync } from "node:fs";

import { seededLifetimeOf, surfacePath } from "../../../config/surface.config.ts";
import { resolve } from "node:path";
import { taxonomy } from "../../../config/taxonomy.config.ts";
import { writeRepair } from "../writers/repair.writer.ts";

const BANNER = "═";

const LIVE_SECTION_LEAD = "**A surface raised from this template";

interface SurfaceRequest {
    readonly repoRoot: string;
    readonly templateSlot: string;
    readonly rootSlot: string;
    readonly subject: string;
    readonly concern: string;
    readonly rehearse: boolean;
}

interface SurfaceOutcome {
    readonly code: number;
    readonly message: string;
}

export const declaredSubjects = function declaredSubjects(): readonly string[] {
    return taxonomy.subjects;
};

export const raisedFrom = function raisedFrom(template: string): string {
    const lines = template.split("\n");
    const live = lines.findIndex((line) => line.startsWith(LIVE_SECTION_LEAD));
    const seeded = live === -1 ? lines : lines.slice(0, live);
    const banner = seeded.findIndex((line) => line.startsWith(BANNER));
    const out = banner === -1 ? [] : seeded.slice(banner);

    return `${out.join("\n").trimEnd()}\n`;
};

export const runSurfaceRaise = function runSurfaceRaise(request: SurfaceRequest): SurfaceOutcome {
    const subject = request.subject.trim();
    if (subject.length === 0) {
        return { code: 2, message: SUBJECT_MISSING };
    }

    if (!declaredSubjects().includes(subject)) {
        return { code: 2, message: subjectUndeclared(subject, declaredSubjects()) };
    }

    if (seededLifetimeOf(request.templateSlot) === null) {
        return { code: 2, message: templateSeedsNothing(request.templateSlot) };
    }

    const templatePath = resolve(request.repoRoot, surfacePath(request.templateSlot));
    if (!existsSync(templatePath)) {
        return { code: 2, message: templateFileMissing(request.templateSlot) };
    }

    const target = `${surfacePath(request.rootSlot)}/${subject}.${request.concern}.md`;
    if (existsSync(resolve(request.repoRoot, target))) {
        return { code: 2, message: surfaceExists(target) };
    }

    const template = readFileSync(templatePath, "utf8");
    const carried = raisedFrom(template);

    if (!carried.includes(BANNER)) {
        return { code: 2, message: contractBlockMissing(request.templateSlot) };
    }

    if (request.rehearse) {
        return { code: 0, message: surfaceRehearsed(target, request.templateSlot) };
    }

    const outcome = writeRepair({ declared: "whole", repoRoot: request.repoRoot }, target, carried);
    if (!outcome.written) {
        return { code: 2, message: outcome.refusal ?? "" };
    }

    return { code: 0, message: surfaceRaised(target, request.templateSlot) };
};
