import {
    FRAMEWORK_SIBLING_THRESHOLD,
    FULL_STACK_EXPORTS,
    FULL_STACK_SEGMENT,
} from "#configuration/constants/figure.constants";
import { normalize, sep } from "node:path";
import { PACKAGE_SCOPE } from "#configuration/constants/manifest.constants";
import type { PackageShape } from "#types/figure.types";
import { isPlainRecord } from "#core/predicates/record.predicate";

const keysOf = function keysOf(value: unknown): string[] {
    return isPlainRecord(value) ? Object.keys(value) : [];
};

export const shapeOf = function shapeOf(moduleDir: string, pkg: Record<string, unknown>): PackageShape {
    const exported = new Set(keysOf(pkg["exports"]));
    const inFullStack = normalize(moduleDir).split(sep).includes(FULL_STACK_SEGMENT);
    if (inFullStack || FULL_STACK_EXPORTS.every((key) => exported.has(key))) {
        return "full-stack";
    }
    const siblings = keysOf(pkg["dependencies"]).filter((dep) => dep.startsWith(PACKAGE_SCOPE));
    return siblings.length >= FRAMEWORK_SIBLING_THRESHOLD ? "framework" : "leaf";
};
