import { CONCERN_MISSING, ROLE_EXISTS, TEMPLATE_WITHOUT_SECTIONS, roleRaised } from "../strings/role.strings.ts";

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { roleFieldsFrom, roleSectionsFrom, roleSubsectionsFrom } from "../inspectors/role.inspector.ts";

const PLACEHOLDER_OPEN = "<";

const PLACEHOLDER_CLOSE = ">";

interface RoleRequest {
    readonly absolute: string;
    readonly template: string;
    readonly letter: string;
    readonly concern: string;
}

interface RoleOutcome {
    readonly code: number;
    readonly message: string;
}

const filled = function filled(field: string, letter: string, concern: string): string {
    const colon = field.indexOf(":");
    const key = colon === -1 ? field : field.slice(0, colon);

    if (key === "letter") {
        return `letter: ${letter}`;
    }
    if (key === "concern") {
        return `concern: ${concern}`;
    }
    if (key === "name") {
        return `name: ${concern}.${letter.toLowerCase()}`;
    }

    return field.endsWith(":") ? `${field} ${PLACEHOLDER_OPEN}unwritten${PLACEHOLDER_CLOSE}` : field;
};

export const runRole = function runRole(request: RoleRequest): RoleOutcome {
    if (request.concern.trim().length === 0) {
        return { code: 2, message: CONCERN_MISSING };
    }

    if (existsSync(request.absolute)) {
        return { code: 2, message: ROLE_EXISTS };
    }

    const template = readFileSync(request.template, "utf8");
    const sections = roleSectionsFrom(template);

    if (sections.length === 0) {
        return { code: 2, message: TEMPLATE_WITHOUT_SECTIONS };
    }

    const lines: string[] = ["---"];
    for (const field of roleFieldsFrom(template)) {
        lines.push(filled(field, request.letter, request.concern));
    }
    lines.push("---", "");

    for (const section of sections) {
        lines.push(section, "", `${PLACEHOLDER_OPEN}unwritten${PLACEHOLDER_CLOSE}`, "");
    }

    for (const subsection of roleSubsectionsFrom(template)) {
        lines.push(subsection, "", `${PLACEHOLDER_OPEN}unwritten${PLACEHOLDER_CLOSE}`, "");
    }

    writeFileSync(request.absolute, lines.join("\n"), "utf8");

    return { code: 0, message: roleRaised(request.letter, request.concern) };
};
