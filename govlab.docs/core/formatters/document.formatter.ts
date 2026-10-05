import { renderRenderable, titleCase } from "#core/formatters/markdown.formatter";
import type { DocumentDecl } from "#types/document.types";
import { FRONTMATTER_FENCE } from "#configuration/constants/document.constants";

const isLead = function isLead(lead: DocumentDecl["lead"]): boolean {
    return typeof lead === "string" || Array.isArray(lead);
};

const frontmatterLines = function frontmatterLines(doc: DocumentDecl): string[] {
    const concern = typeof doc.concern === "string" && doc.concern.length > 0 ? [`concern: ${doc.concern}`] : [];
    const status = typeof doc.status === "string" && doc.status.length > 0 ? [`status: ${doc.status}`] : [];
    return [`type: ${doc.type}`, `name: ${doc.name}`, `summary: ${doc.summary}`, ...concern, ...status];
};

export const renderDeclaredDoc = function renderDeclaredDoc(doc: DocumentDecl): string {
    const heading = doc.title ?? titleCase(doc.name);
    const lead = isLead(doc.lead) ? `${renderRenderable(doc.lead)}\n\n` : "";
    const sections = doc.body.map((entry) => `## ${entry.heading}\n\n${renderRenderable(entry.content)}`).join("\n\n");
    const frontmatter = [FRONTMATTER_FENCE, ...frontmatterLines(doc), FRONTMATTER_FENCE].join("\n");
    return `${frontmatter}\n\n# ${heading}\n\n${lead}${sections}\n`;
};
