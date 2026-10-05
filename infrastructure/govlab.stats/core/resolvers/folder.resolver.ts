import { arrayField, field, stringsIn } from "#core/selectors/field.selector";
import { loadGovlabConfig } from "@govlab/quality/config";
import { relativePath } from "@ssot/paths";

export const otherGateClaims = async function otherGateClaims(root: string): Promise<readonly string[]> {
    const docs = field(await loadGovlabConfig(root), "docs");
    const boundary = stringsIn(arrayField(docs, "boundaryDocs"));
    return [relativePath("docArch"), relativePath("claude"), ...boundary];
};
