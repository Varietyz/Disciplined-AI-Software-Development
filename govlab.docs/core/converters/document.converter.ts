import type { DocNode } from "#types/document.types";
import { fileTokens } from "#core/parsers/metadata.parser";

const edgeList = function edgeList(fields: Readonly<Record<string, string>>, key: string): string[] {
    const raw = fields[key];
    return typeof raw === "string" ? fileTokens(raw) : [];
};

export const docNodeOf = function docNodeOf(relDoc: string, fields: Readonly<Record<string, string>>): DocNode {
    return {
        concern: fields["concern"] ?? "",
        dependsOn: edgeList(fields, "depends-on"),
        governs: edgeList(fields, "governs"),
        links: edgeList(fields, "links"),
        name: fields["name"] ?? "",
        relPath: relDoc,
        status: fields["status"] ?? "",
        summary: fields["summary"] ?? "",
        supersedes: edgeList(fields, "supersedes"),
        type: fields["type"] ?? "",
    };
};
