import { canonRefsFor } from "#configuration/quality/generated/canon.generated";

export const withCanon = function withCanon(text: string, ruleId: string, canonical: readonly string[]): string {
    const canonRef = canonical.length > 0 ? ` [canon: ${canonRefsFor(canonical).join(" ")}]` : "";
    return `${text} [${ruleId}]${canonRef}`;
};
