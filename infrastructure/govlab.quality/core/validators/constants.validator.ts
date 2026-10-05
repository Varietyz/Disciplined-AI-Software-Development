import { CONSTANT_EXTENSIONS, RUNTIME_RELATIVE_MARKERS } from "#configuration/constants/validation.constants";
import {
    constantAlias,
    constantAliasFix,
    constantDuplicate,
    constantDuplicateFix,
} from "#configuration/strings/validation.strings";
import type { FileInput } from "#types/validation.types";
import type { Finding } from "#types/finding.types";
import { captureValue } from "#core/parsers/constants.parser";
import { defineValidator } from "#core/registries/validation.registry";
import { everyChar } from "@govlab/constants";
import { isIdentChar } from "#core/predicates/code-point.predicate";
import { isUpperSnake } from "#core/predicates/constants.predicate";
import { projectFinding } from "#core/factories/finding.factory";

const EXPORT_PREFIX = "export ";
const CONST_PREFIX = "const ";

const skipSpaces = function skipSpaces(text: string, from: number): number {
    let i = from;
    while (i < text.length && text[i] === " ") {
        i += 1;
    }
    return i;
};

const identEnd = function identEnd(text: string, from: number): number {
    let i = from;
    while (i < text.length && isIdentChar(text.codePointAt(i))) {
        i += 1;
    }
    return i;
};

const constantName = function constantName(line: string): string | null {
    const trimmed = line.trim();
    const body = trimmed.startsWith(EXPORT_PREFIX) ? trimmed.slice(EXPORT_PREFIX.length).trimStart() : trimmed;
    if (!body.startsWith(CONST_PREFIX)) {
        return null;
    }
    const start = skipSpaces(body, CONST_PREFIX.length);
    const end = identEnd(body, start);
    const name = body.slice(start, end);
    return name.length > 0 && body[skipSpaces(body, end)] === "=" ? name : null;
};

const upperConstantName = function upperConstantName(line: string): string | null {
    const name = constantName(line);
    return name !== null && isUpperSnake(name) ? name : null;
};

const assignedValue = function assignedValue(line: string): string | null {
    const eq = line.indexOf("=");
    if (eq === -1) {
        return null;
    }
    const value = line.slice(eq + 1).trim();
    const semi = value.indexOf(";");
    return semi === -1 ? value : value.slice(0, semi).trim();
};

interface ConstantSite {
    name: string;
    path: string;
    value: string;
}

const fileSites = function fileSites(file: FileInput): ConstantSite[] {
    const seen = new Set<string>();
    const sites: ConstantSite[] = [];
    const lines = file.content.split("\n");
    let index = 0;
    while (index < lines.length) {
        const name = upperConstantName(lines[index] ?? "");
        if (name === null || seen.has(name)) {
            index += 1;
        } else {
            seen.add(name);
            const captured = captureValue(lines, index);
            if (!RUNTIME_RELATIVE_MARKERS.some((marker) => captured.value.includes(marker))) {
                sites.push({ name, path: file.path, value: captured.value });
            }
            index = captured.endIndex + 1;
        }
    }
    return sites;
};

const duplicateGroups = function duplicateGroups(files: readonly FileInput[]): { name: string; paths: string[] }[] {
    const sites = files.flatMap(fileSites);
    const valuesByName = new Map<string, Set<string>>();
    const groups = new Map<string, { name: string; paths: string[] }>();
    for (const site of sites) {
        valuesByName.set(site.name, (valuesByName.get(site.name) ?? new Set()).add(site.value));
        const key = `${site.name}\n${site.value}`;
        const group = groups.get(key) ?? { name: site.name, paths: [] };
        group.paths.push(site.path);
        groups.set(key, group);
    }
    return [...groups.values()].filter((group) => group.paths.length > 1 && valuesByName.get(group.name)?.size === 1);
};

const soleIdentifier = function soleIdentifier(value: string): string | null {
    return value.length > 0 && everyChar(value, (ch) => isIdentChar(ch.codePointAt(0))) ? value : null;
};

const aliasTarget = function aliasTarget(
    name: string,
    value: string | null,
    declared: ReadonlySet<string>,
): string | null {
    const target = value === null ? null : soleIdentifier(value);
    if (target === null || target === name) {
        return null;
    }
    return isUpperSnake(target) && declared.has(target) ? target : null;
};

const aliasFinding = function aliasFinding(file: FileInput, line: string, declared: ReadonlySet<string>): Finding[] {
    const trimmed = line.trim();
    const name = upperConstantName(trimmed);
    const target = name === null ? null : aliasTarget(name, assignedValue(trimmed), declared);
    if (name === null || target === null) {
        return [];
    }
    return [
        projectFinding({
            file: file.path,
            message: constantAlias(name, target),
            ruleId: "constant-aliases",
            suggestion: constantAliasFix(name, target),
        }),
    ];
};

defineValidator({
    appliesTo: CONSTANT_EXTENSIONS,
    id: "constant-aliases",
    meta: {
        canonical: ["duplicate-code", "central-config"],
        description: "Flag a constant that is a bare alias of another constant; reference it directly",
    },
    validate(files) {
        const declared = new Set(
            files.flatMap((file) =>
                file.content.split("\n").flatMap((line) => {
                    const name = upperConstantName(line);
                    return name === null ? [] : [name];
                }),
            ),
        );
        return files.flatMap((file) => file.content.split("\n").flatMap((line) => aliasFinding(file, line, declared)));
    },
});

defineValidator({
    appliesTo: CONSTANT_EXTENSIONS,
    id: "constant-duplicates",
    meta: {
        canonical: ["duplicate-code", "central-config"],
        description: "Flag a constant name defined in multiple files; centralize it",
    },
    validate(files) {
        return duplicateGroups(files).flatMap(({ name, paths }) =>
            paths.map((path) =>
                projectFinding({
                    file: path,
                    message: constantDuplicate(name, paths.length),
                    ruleId: "constant-duplicates",
                    suggestion: constantDuplicateFix(name, paths.length),
                }),
            ),
        );
    },
});
