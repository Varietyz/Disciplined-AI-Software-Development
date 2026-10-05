import type { GovlabStylelintMeta } from "#types/stylelint.types";
import type { Plugin } from "stylelint";
import { isRecord } from "#core/selectors/record.selector";

export const isStylelintPlugin = function isStylelintPlugin(value: unknown): value is Plugin {
    return isRecord(value) && typeof value["ruleName"] === "string" && typeof value["rule"] === "function";
};

export const isStylelintMeta = function isStylelintMeta(value: unknown): value is GovlabStylelintMeta {
    if (!isRecord(value) || typeof value["ruleId"] !== "string" || typeof value["ruleName"] !== "string") {
        return false;
    }
    const { meta } = value;
    return isRecord(meta) && typeof meta["description"] === "string" && Array.isArray(meta["canonical"]);
};
