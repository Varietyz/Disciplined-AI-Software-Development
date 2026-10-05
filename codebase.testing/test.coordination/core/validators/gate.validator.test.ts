import { EXEMPTION_SAMPLED, healerThrew, ruleThrew } from "coordination-surface/tools/core/strings/gate.strings.ts";
import { describe, it } from "vitest";
import { judge, unsuppliedReads } from "coordination-surface/tools/core/validators/gate.validator.ts";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { writeVerbatim } from "@govlab/canonical-write";

type Declaration = Parameters<typeof judge>[1];
type Result = ReturnType<Declaration["check"]>;

const SAMPLE = "a.md";
const BAD = { path: SAMPLE, text: "bad" };
const GOOD = { path: SAMPLE, text: "good" };

const found = function found(path: string, target = path): Result["findings"][number] {
    return {
        actual: "bad",
        expected: null,
        healed: false,
        line: 1,
        locus: "bad",
        path,
        remediation: { action: "declare", decide: "", deterministic: false, from: null, target, to: null },
        rule: "probe/bad",
        stack: [],
    };
};

const declaration = function declaration(check: Declaration["check"], reads?: readonly string[]): Declaration {
    return {
        check,
        extensions: [],
        heals: true,
        invariant: "",
        jurisdiction: "all",
        kinds: ["bad"],
        stage: "content",
        ...(reads === undefined ? {} : { reads }),
    };
};

const firesOnBad = declaration((context) => ({
    findings: context.read(SAMPLE).includes("bad") ? [found(SAMPLE)] : [],
    healed: [],
}));

const healing = function healing(writes: boolean): Declaration {
    return declaration((context, fix) => {
        const bad = context.read(SAMPLE).includes("bad");
        if (fix && bad && writes) {
            writeVerbatim(resolve(context.repoRoot, SAMPLE), "good");
        }
        return { findings: bad && !fix ? [found(SAMPLE)] : [], healed: fix && bad ? [SAMPLE] : [] };
    });
};

describe("unsuppliedReads", () => {
    it("names each file a rule declares it reads that no sample supplies, unless the fixture is exempt or on disk", () => {
        const reads = declaration(firesOnBad.check, [SAMPLE, "b.md"]);
        assert.deepEqual(unsuppliedReads(reads, { fires: [BAD], rule: "probe" }), ["b.md"]);
        assert.deepEqual(unsuppliedReads(reads, { exempt: "why", rule: "probe" }), []);
        assert.deepEqual(unsuppliedReads(reads, { fires: [BAD], onDisk: true, rule: "probe" }), []);
        assert.deepEqual(unsuppliedReads(firesOnBad, { fires: [BAD], rule: "probe" }), []);
    });
});

describe("judge", () => {
    it("proves a rule that fires on its violating sample and accepts its clean one", () => {
        assert.equal(
            judge("probe", firesOnBad, "", { fires: [BAD], kind: "bad", passes: [GOOD], rule: "probe" }).state,
            "proven",
        );
    });

    it("reads a rule that stays silent on its violation, fires on clean input, throws or aims elsewhere as unproven", () => {
        assert.equal(judge("probe", firesOnBad, "", { fires: [GOOD], rule: "probe" }).state, "silent");
        assert.equal(judge("probe", firesOnBad, "", { fires: [BAD], passes: [BAD], rule: "probe" }).state, "noisy");
        const thrower = declaration(() => {
            throw new Error("broke");
        });
        assert.equal(judge("probe", thrower, "", { fires: [BAD], rule: "probe" }).detail, ruleThrew("Error: broke"));
        const astray = declaration(() => ({ findings: [found(SAMPLE, "elsewhere.md")], healed: [] }));
        assert.equal(judge("probe", astray, "", { fires: [BAD], rule: "probe" }).state, "noisy");
    });

    it("keeps an exemption, and refuses one that also carries samples", () => {
        assert.deepEqual(judge("probe", firesOnBad, "", { exempt: "reads the host", rule: "probe" }), {
            detail: "reads the host",
            rule: "probe",
            state: "exempt",
        });
        assert.equal(
            judge("probe", firesOnBad, "", { exempt: "x", fires: [BAD], rule: "probe" }).detail,
            EXEMPTION_SAMPLED,
        );
    });

    it("proves a healer whose repair survives its own re-check, and names one that heals nothing, fails to converge or throws", () => {
        assert.equal(judge("probe", healing(true), "", { heals: [BAD], rule: "probe" }).state, "proven");
        assert.equal(judge("probe", firesOnBad, "", { heals: [BAD], rule: "probe" }).state, "silent");
        assert.equal(judge("probe", healing(false), "", { heals: [BAD], rule: "probe" }).state, "noisy");
        const throwing = declaration(() => {
            throw new Error("heal broke");
        });
        assert.equal(
            judge("probe", throwing, "", { heals: [BAD], rule: "probe" }).detail,
            healerThrew("Error: heal broke"),
        );
    });
});
