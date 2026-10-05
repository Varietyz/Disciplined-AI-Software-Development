import {
    DELEGATED_SCRIPTS,
    MEMBER_MANIFEST,
    PACKAGE_FILE,
    SCRIPTS_KEY,
    SELF_GOVERNED_KEY,
} from "#configuration/constants/stage.constants";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import type { Step } from "#types/stage.types";
import { absolutePath } from "@ssot/paths";
import { delegatedLabel } from "#configuration/strings/step.strings";
import { join } from "node:path";

const fieldOf = function fieldOf(parsed: unknown, key: string, field: string): string | null {
    if (typeof parsed !== "object" || parsed === null || !(key in parsed)) {
        return null;
    }
    const declared: unknown = new Map(Object.entries(parsed)).get(key);
    if (typeof declared !== "object" || declared === null) {
        return null;
    }
    const value: unknown = new Map(Object.entries(declared)).get(field);
    return typeof value === "string" ? value : null;
};

const readJson = function readJson(file: string): unknown {
    return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : null;
};

const delegatedSteps = function delegatedSteps(member: string): Step[] {
    const dir = join(absolutePath("app.root"), member);
    const manifest = readJson(join(dir, MEMBER_MANIFEST));
    const scripts = readJson(join(dir, PACKAGE_FILE));
    return DELEGATED_SCRIPTS.flatMap(([field, verb]) => {
        const script = fieldOf(manifest, SELF_GOVERNED_KEY, field);
        const command = script === null ? null : fieldOf(scripts, SCRIPTS_KEY, script);
        return command === null ? [] : [{ cwd: dir, label: delegatedLabel(verb, member), run: command }];
    });
};

export const selfGovernedSteps = function selfGovernedSteps(): Step[] {
    return readdirSync(absolutePath("app.root")).flatMap(delegatedSteps);
};
