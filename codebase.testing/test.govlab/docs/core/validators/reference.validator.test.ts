import { DOC_VERBS, REF_CLAIMS } from "@govlab/docs/configuration/constants/verb.constants.ts";
import { describe, expect, it } from "vitest";
import { refConstructs, resolveRefs } from "@govlab/docs/core/validators/reference.validator.ts";
import { ROOT } from "@ssot/paths";

const options = { claims: REF_CLAIMS, verbs: DOC_VERBS };
const context = { roots: [ROOT], verbs: DOC_VERBS };

const defectCodes = function defectCodes(source: string): string[] {
    return refConstructs(source, options).defects.map((defect) => defect.code);
};

describe("refConstructs", () => {
    it("reads a declared verb with a backticked identifier and a quoted path as a construct", () => {
        const scan = refConstructs('body\n\ndefined at: `ROOT` "`package.json`"\n', options);
        expect(scan.defects).toStrictEqual([]);
        expect(
            scan.constructs.map((construct) => [construct.verb, construct.identifier, construct.path]),
        ).toStrictEqual([["defined at", "ROOT", "package.json"]]);
    });

    it("reports an undeclared verb and yields nothing for plain prose", () => {
        expect(defectCodes('body\n\nproved by: `ROOT` "`package.json`"\n')).toStrictEqual(["unknown-verb"]);
        expect(refConstructs("body\n\nsee: the guide next door.\n", options)).toStrictEqual({
            constructs: [],
            defects: [],
        });
    });

    it("reports an unsatisfied claim and an unknown claim", () => {
        expect(defectCodes("---\nvalidates: [identifiers]\n---\n\nbody\n")).toStrictEqual(["unsatisfied-claim"]);
        expect(defectCodes("---\nvalidates: [colors]\n---\n\nbody\n")).toStrictEqual(["unknown-claim"]);
    });

    it("skips a construct inside a fence", () => {
        expect(
            refConstructs('body\n\n```\ndefined at: `ROOT` "`package.json`"\n```\n', options).constructs,
        ).toStrictEqual([]);
    });
});

describe("resolveRefs", () => {
    it("reports an undeclared verb and a path no root resolves, and stays silent on nothing", () => {
        const unknown = resolveRefs(
            [{ col: 1, identifier: "ROOT", line: 3, path: "package.json", verb: "proved by" }],
            context,
        );
        expect(unknown.map((finding) => finding.line)).toStrictEqual([3]);
        expect(
            resolveRefs([{ col: 1, identifier: "ROOT", line: 1, path: "no/such/file.ts", verb: "see" }], context),
        ).toHaveLength(1);
        expect(resolveRefs([], context)).toStrictEqual([]);
    });
});
