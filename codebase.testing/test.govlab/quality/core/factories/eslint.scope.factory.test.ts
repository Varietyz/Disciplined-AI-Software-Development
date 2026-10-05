import {
    baseConfigs,
    disableTypeCheckedRules,
    exclusionScopes,
    htmlScope,
    langScopes,
    manifestScope,
    optionalScopes,
    tsScopeOverride,
    tsTestScope,
} from "@govlab/quality/core/factories/eslint.scope.factory.ts";
import { expect, test } from "vitest";

test("the eslint scope factory builds each scope of the flat config", async () => {
    expect(exclusionScopes([])).toStrictEqual([]);
    expect(disableTypeCheckedRules([])).toStrictEqual({});
    expect(optionalScopes({})).toStrictEqual([]);
    expect(typeof tsScopeOverride({})).toBe("object");
    expect(Array.isArray(await langScopes([], {}))).toBe(true);
    expect(await manifestScope([], {})).toBeNull();
    for (const factory of [baseConfigs, htmlScope, tsTestScope]) {
        expect(typeof factory).toBe("function");
    }
});
