import { DOC_STATUSES } from "#configuration/constants/document.constants";
import type { FrontmatterSchema } from "#types/metadata.types";
import { REF_CLAIMS } from "#configuration/constants/verb.constants";

export const DOC_ARCH_FRONTMATTER_SCHEMA: FrontmatterSchema = {
    fields: { status: { enum: DOC_STATUSES }, validates: { items: REF_CLAIMS } },
    required: ["status"],
};
