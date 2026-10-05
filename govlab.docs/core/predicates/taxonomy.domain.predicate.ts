import { DOMAIN_TAXONOMY } from "#configuration/constants/taxonomy.domain.constants";

export const isDomainMeta = function isDomainMeta(meta: unknown): meta is string {
    return typeof meta === "string" && Object.hasOwn(DOMAIN_TAXONOMY, meta);
};

export const isDomainSub = function isDomainSub(meta: unknown, sub: unknown): boolean {
    if (!isDomainMeta(meta) || typeof sub !== "string") {
        return false;
    }
    return (DOMAIN_TAXONOMY[meta] ?? []).includes(sub);
};
