import type { CanonicalData, CanonicalSettingRecord } from "@govlab/quality/types/canon.types.ts";
import type { ConcernConfig, ConcernValue } from "@govlab/quality/types/concern.types.ts";
import {
    concernsToCanonicalConfig,
    parseConcernValue,
    resolveConcernMap,
} from "@govlab/quality/core/converters/concern.converter.ts";
import { describe, expect, it } from "vitest";

const CYCLO = 12;
const DEEP = 3;
const LONG = 20;
const FILE_LEN = 200;
const LINE_LEN = 120;
const ACCESS = 5;
const VALUE_KIND = "value";
const DEEP_NESTING = "deep-nesting";

const cm = function cm(entries: [string, ConcernValue][]): ConcernConfig {
    return Object.fromEntries(entries);
};

const setting = function setting(id: string, kind: CanonicalSettingRecord["kind"]): CanonicalSettingRecord {
    return { default: null, dimension: "probe", id, kind, surface: "probe", valueType: "number" };
};

const DATA: CanonicalData = {
    conflicts: [],
    ownership: [],
    rows: [],
    settings: [
        setting("long-function", VALUE_KIND),
        setting(DEEP_NESTING, VALUE_KIND),
        setting("cyclomatic-complexity", VALUE_KIND),
        setting("too-many-params", VALUE_KIND),
        setting("indentation", VALUE_KIND),
        setting("access-control", "rule-intent"),
        setting("csp", "rule-intent"),
    ],
};

describe("concernsToCanonicalConfig", () => {
    it("maps numeric concerns into the value channel of matching value-kind settings", () => {
        const out = concernsToCanonicalConfig(
            cm([
                [DEEP_NESTING, DEEP],
                ["long-function", LONG],
            ]),
            DATA,
        );
        expect(out.values).toEqual(
            cm([
                [DEEP_NESTING, DEEP],
                ["long-function", LONG],
            ]),
        );
        expect(out.enabled).toBeUndefined();
    });

    it("aliases the 'spacing' concern onto the 'indentation' value setting", () => {
        expect(concernsToCanonicalConfig({ spacing: 4 }, DATA).values).toEqual({ indentation: 4 });
    });

    it("skips concerns with no value setting (line-length, file-length)", () => {
        const out = concernsToCanonicalConfig(
            cm([
                ["file-length", FILE_LEN],
                ["line-length", LINE_LEN],
            ]),
            DATA,
        );
        expect(out.values).toBeUndefined();
        expect(out.enabled).toBeUndefined();
    });

    it("takes the numeric operand from a [severity, value] array", () => {
        const out = concernsToCanonicalConfig(cm([["cyclomatic-complexity", ["warn", CYCLO]]]), DATA);
        expect(out.values).toEqual(cm([["cyclomatic-complexity", CYCLO]]));
    });

    it("opts a rule-intent setting in on `true`, and skips `false`", () => {
        const out = concernsToCanonicalConfig(
            cm([
                ["access-control", true],
                ["csp", false],
            ]),
            DATA,
        );
        expect(out.enabled).toEqual(cm([["access-control", true]]));
    });

    it("ignores a numeric concern aimed at a rule-intent setting", () => {
        const out = concernsToCanonicalConfig(cm([["access-control", ACCESS]]), DATA);
        expect(out.values).toBeUndefined();
        expect(out.enabled).toBeUndefined();
    });
});

describe("parseConcernValue", () => {
    it("reads each concern value shape", () => {
        expect(parseConcernValue(true)).toStrictEqual({ exclude: false });
        expect(parseConcernValue(false)).toStrictEqual({ exclude: true });
        expect(parseConcernValue(DEEP)).toStrictEqual({ exclude: false, value: DEEP });
        expect(parseConcernValue("single")).toStrictEqual({ exclude: false, optionValue: ["single"] });
        expect(parseConcernValue(["a", 1])).toStrictEqual({ exclude: false, optionValue: ["a", 1] });
    });
});

describe("resolveConcernMap", () => {
    it("resolves each concept entry", () => {
        expect(resolveConcernMap(cm([[DEEP_NESTING, DEEP]])).get(DEEP_NESTING)).toStrictEqual({
            exclude: false,
            value: DEEP,
        });
    });
});
