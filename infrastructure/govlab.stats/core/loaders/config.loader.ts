import {
    BASE_CONFIG,
    MEMBER_CONFIG,
    STRICT_FLAGS,
    UNSPECIFIED_TARGET,
} from "#configuration/constants/config.constants";
import type { MemberConfig, TypescriptStats } from "#types/config.types";
import { field, stringField } from "#core/selectors/field.selector";
import { existsSync } from "node:fs";
import { isRecord } from "#core/predicates/record.predicate";
import path from "node:path";
import { posixOf } from "#core/selectors/source.selector";
import { readJson } from "#core/loaders/data.loader";
import { workspaceMembers } from "#core/resolvers/package.resolver";

const memberConfigOf = function memberConfigOf(root: string, abs: string): MemberConfig {
    const member = posixOf(path.relative(root, abs));
    const file = path.join(abs, MEMBER_CONFIG);
    if (!existsSync(file)) {
        return { extendsBase: false, member, present: false };
    }
    return { extendsBase: stringField(readJson(file), "extends").includes(BASE_CONFIG), member, present: true };
};

export const collectTypescript = function collectTypescript(root: string): TypescriptStats {
    const members = workspaceMembers(root).map((abs) => memberConfigOf(root, abs));
    const options = field(readJson(path.join(root, BASE_CONFIG)), "compilerOptions");
    return {
        baseOptions: isRecord(options) ? Object.keys(options).length : 0,
        covered: members.filter((entry) => entry.present).length,
        members,
        strictFlags: STRICT_FLAGS.map((flag): [string, boolean] => [flag, field(options, flag) === true]),
        target: stringField(options, "target") || UNSPECIFIED_TARGET,
        total: members.length,
        uncovered: members.filter((entry) => !entry.present).map((entry) => entry.member),
    };
};
