import { DEFAULT_BODY, MODULE_BODY } from "#configuration/strings/template.strings";
import { FRONTMATTER_FENCE } from "#configuration/constants/document.constants";
import type { TemplateSpec } from "#types/document.types";
import { titleCase } from "#core/formatters/markdown.formatter";

const LINE_BREAK = "\n";
const MODULE_AXIS = "module";

const field = function field(key: string, value: string): string {
    return `${key}: ${value}`;
};

export const renderTemplate = function renderTemplate(spec: TemplateSpec): string {
    const isModule = spec.def.ownerAxis === MODULE_AXIS;
    const frontmatter = [
        FRONTMATTER_FENCE,
        field("type", spec.form),
        field("name", spec.name),
        field("summary", spec.summary),
        ...(isModule ? [] : [field("concern", spec.concern)]),
        field("status", spec.status),
        FRONTMATTER_FENCE,
    ];
    return [...frontmatter, "", `# ${titleCase(spec.name)}`, "", isModule ? MODULE_BODY : DEFAULT_BODY, ""].join(
        LINE_BREAK,
    );
};
