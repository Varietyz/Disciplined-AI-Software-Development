import {
    APPEND_NEEDS_LEAD,
    EXTRACT_NEEDS_BODY,
    FIXTURE_NEEDS_BODY,
    MEMBER_NEEDS_BODY,
} from "../strings/board.strings.ts";
import type { Invocation, Outcome } from "../types/invocation.types.ts";
import { argumentValue, bodyOr, joinedValue, refuseFixedTarget, textOperand } from "../readers/invocation.reader.ts";
import { healRequested, runMark } from "../runners/mark.runner.ts";
import { historyPath, projectRoot, surfacePath } from "../../../config/surface.config.ts";
import { runEntry, runExtend, runRepair } from "../runners/archive.runner.ts";
import { runIndex, runTransition } from "../runners/index.runner.ts";
import { NO_FIX_FLAG } from "../constants/path.constants.ts";
import { discoverRules } from "../registries/rule.registry.ts";
import { resolve } from "node:path";
import { runFixture } from "../runners/fixture.runner.ts";
import { runHalf } from "../runners/conduct.runner.ts";
import { runMember } from "../runners/member.runner.ts";
import { runRole } from "../runners/role.runner.ts";
import { runSurfaceRaise } from "../runners/surface.runner.ts";
import { runTask } from "../runners/task.runner.ts";
import { textIfPresent } from "../readers/venue.reader.ts";

const REPO_ROOT = projectRoot();

const CHANGELOG = historyPath();

const RAISE_FORMS: readonly [string, { template: string; root: string; concern: string }][] = [
    ["--model", { concern: "model", root: "models", template: "model_template" }],
    ["--finding", { concern: "finding", root: "findings", template: "finding_template" }],
    ["--distribute", { concern: "checklist", root: "planning", template: "planning_template" }],
];

export const append = function append(): Outcome | null {
    const heading = argumentValue("--append");
    if (heading === null) {
        return null;
    }

    refuseFixedTarget("--append", CHANGELOG);
    const lead = argumentValue("--lead");
    const body = textOperand("--body", "--body-file");
    if (lead === null || body === null) {
        return { code: 2, message: APPEND_NEEDS_LEAD };
    }

    return runExtend({ archive: resolve(REPO_ROOT, CHANGELOG), body, heading, lead });
};

export const repair = function repair(): Outcome | null {
    const heading = argumentValue("--repair");
    if (heading === null) {
        return null;
    }

    refuseFixedTarget("--repair", CHANGELOG);
    return runRepair({ archive: resolve(REPO_ROOT, CHANGELOG), heading });
};

export const extract = function extract(): Outcome | null {
    const heading = argumentValue("--extract");
    if (heading === null) {
        return null;
    }

    refuseFixedTarget("--extract", CHANGELOG);
    return bodyOr(EXTRACT_NEEDS_BODY, (body) => runEntry({ archive: resolve(REPO_ROOT, CHANGELOG), body, heading }));
};

export const fixture = function fixture({ absolute, target }: Invocation): Outcome | null {
    const pair = argumentValue("--fixture");
    return pair === null
        ? null
        : bodyOr(FIXTURE_NEEDS_BODY, (body) =>
              runFixture({ absolute, body, pair, target, witness: textIfPresent(absolute) }),
          );
};

export const member = function member({ absolute, target }: Invocation): Outcome | null {
    const heading = argumentValue("--member");
    return heading === null
        ? null
        : bodyOr(MEMBER_NEEDS_BODY, (body) => runMember({ absolute, body, heading, target }));
};

export const role = function role({ caller }: Invocation): Outcome | null {
    const concern = joinedValue("--role");
    if (concern === null) {
        return null;
    }

    refuseFixedTarget("--role", surfacePath("roles"));
    return runRole({
        absolute: resolve(REPO_ROOT, `${surfacePath("roles")}/${concern.trim()}.${caller.toLowerCase()}.role.md`),
        concern: concern.trim(),
        letter: caller,
        template: resolve(REPO_ROOT, surfacePath("role_template")),
    });
};

export const surfaceRaise = function surfaceRaise(): Outcome | null {
    const [form] = RAISE_FORMS.flatMap(([flag, slots]) => {
        const subject = joinedValue(flag);
        return subject === null ? [] : [{ flag, slots, subject }];
    });
    if (form === undefined) {
        return null;
    }

    refuseFixedTarget(form.flag, surfacePath(form.slots.root));
    return runSurfaceRaise({
        concern: form.slots.concern,
        rehearse: !healRequested(process.argv, NO_FIX_FLAG),
        repoRoot: REPO_ROOT,
        rootSlot: form.slots.root,
        subject: form.subject,
        templateSlot: form.slots.template,
    });
};

const halfOutcome = async function halfOutcome(slug: string): Promise<Outcome> {
    const registry = await discoverRules(REPO_ROOT);
    return runHalf({
        registered: registry.rules.map((entry) => entry.id),
        repoRoot: REPO_ROOT,
        slug,
        target: surfacePath("conduct_roster"),
        value: argumentValue("--observer") ?? "",
    });
};

export const half = function half(): Promise<Outcome> | null {
    const slug = argumentValue("--half");
    if (slug === null) {
        return null;
    }

    refuseFixedTarget("--half", surfacePath("conduct_roster"));
    return halfOutcome(slug);
};

export const task = function task({ caller, target }: Invocation): Outcome | null {
    const id = argumentValue("--task");
    return id === null
        ? null
        : runTask({ id, owner: caller, repoRoot: REPO_ROOT, statement: joinedValue("--statement") ?? "", target });
};

export const mark = function mark({ absolute, caller, target }: Invocation): Outcome | null {
    const item = argumentValue("--mark");
    return item === null ? null : runMark({ absolute, agent: caller, item, target });
};

export const transition = function transition({ caller }: Invocation): Outcome | null {
    const state = argumentValue("--transition");
    if (state === null) {
        return null;
    }

    refuseFixedTarget("--transition", surfacePath("agent_index"));
    return runTransition({
        absolute: resolve(REPO_ROOT, surfacePath("agent_index")),
        by: caller,
        letter: argumentValue("--seat") ?? caller,
        state,
        warrant: argumentValue("--ref"),
    });
};

export const index = function index(): Outcome | null {
    const indexed = joinedValue("--index");
    if (indexed === null) {
        return null;
    }

    refuseFixedTarget("--index", surfacePath("agent_index"));
    return runIndex({ absolute: resolve(REPO_ROOT, surfacePath("agent_index")), role: indexed });
};
