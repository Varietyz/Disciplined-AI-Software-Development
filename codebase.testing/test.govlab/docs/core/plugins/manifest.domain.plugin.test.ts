import { describe, expect, it } from "vitest";
import { MANIFEST_ERRORS } from "@govlab/docs/configuration/strings/manifest.strings.ts";
import { plugin } from "@govlab/docs/core/plugins/manifest.domain.plugin.ts";
import { validateManifest } from "@govlab/docs/core/validators/manifest.validator.ts";

const BASE = { label: "X", maturity: "experimental", summary: "does x", visibility: { hidden: false, private: false } };

const errorsOf = function errorsOf(domains?: unknown): string[] {
    return validateManifest(domains === undefined ? BASE : { ...BASE, domains }, [plugin]);
};

describe("the domain manifest plugin", () => {
    it("accepts one or several valid domains", () => {
        expect(errorsOf([{ meta: "commerce", sub: "payments" }])).toStrictEqual([]);
        expect(
            errorsOf([
                { meta: "media", sub: "speech-to-text" },
                { meta: "ai", sub: "speech" },
            ]),
        ).toStrictEqual([]);
    });

    it("requires at least one domain", () => {
        expect(errorsOf()).toStrictEqual([MANIFEST_ERRORS.domainsRequired]);
        expect(errorsOf([])).toStrictEqual([MANIFEST_ERRORS.domainsRequired]);
    });

    it("reports an unknown meta, a foreign sub, a non-object and a duplicate", () => {
        expect(errorsOf([{ meta: "nonsense", sub: "payments" }])).toStrictEqual([
            "domains[0].meta 'nonsense' is not a known software-domain meta",
        ]);
        expect(errorsOf([{ meta: "commerce", sub: "encryption" }])).toStrictEqual([
            "domains[0].sub 'encryption' is not a sub-domain of 'commerce'",
        ]);
        expect(errorsOf(["commerce"])).toStrictEqual(["domains[0] must be an object { meta, sub }"]);
        expect(
            errorsOf([
                { meta: "commerce", sub: "payments" },
                { meta: "commerce", sub: "payments" },
            ]),
        ).toStrictEqual(["domains[1] 'commerce/payments' is declared twice"]);
    });

    it("contributes the declared domains to the catalog entry", () => {
        const entry = { category: null, value: "x" };
        plugin.contribute?.({ domains: [{ meta: "commerce", sub: "payments" }] }, entry);
        expect(entry).toHaveProperty("domains", [{ meta: "commerce", sub: "payments" }]);
    });
});
