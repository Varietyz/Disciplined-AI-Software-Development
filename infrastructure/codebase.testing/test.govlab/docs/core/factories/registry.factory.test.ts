import { describe, expect, it } from "vitest";
import type { DocForm } from "@govlab/docs/types/location.types.ts";
import { RegistryBuilder } from "@govlab/docs/core/factories/registry.factory.ts";
import type { UserRegistries } from "@govlab/docs/types/manifest.types.ts";

const GUIDE: DocForm = { boundary: false, folder: "guides", id: "guide", kind: "authored", ownerAxis: "concern" };
const BASE: UserRegistries = {
    activityVerbs: { scaling: "scale" },
    concerns: ["scaling"],
    forms: { guide: GUIDE },
    refVerbs: {},
};

const CANDIDATE_FORMS: readonly unknown[] = [
    { ...GUIDE, folder: "runbooks", id: "runbook" },
    { ...GUIDE, id: "clash" },
    { id: "broken" },
];
const CANDIDATE_CONCERNS: readonly unknown[] = [{ concern: "operations", verb: "operate" }, "scaling", ""];
const CANDIDATE_VERBS: readonly unknown[] = [
    { checks: ["path"], satisfies: ["paths"], verb: "uses" },
    { verb: "broken" },
];

const builtRegistries = function builtRegistries(): UserRegistries {
    const builder = new RegistryBuilder(BASE);
    for (const form of CANDIDATE_FORMS) {
        builder.addForm(form);
    }
    for (const concern of CANDIDATE_CONCERNS) {
        builder.addConcern(concern);
    }
    for (const verb of CANDIDATE_VERBS) {
        builder.addRefVerb(verb);
    }
    return builder.frozen();
};

describe("RegistryBuilder", () => {
    it("adds valid forms, concerns and reference verbs once, and refuses malformed or colliding ones", () => {
        const registries = builtRegistries();
        expect(Object.keys(registries.forms)).toStrictEqual(["guide", "runbook"]);
        expect(registries.concerns).toStrictEqual(["scaling", "operations"]);
        expect(registries.activityVerbs).toStrictEqual({ operations: "operate", scaling: "scale" });
        expect(Object.keys(registries.refVerbs)).toStrictEqual(["uses"]);
        expect(Object.isFrozen(registries.forms)).toBe(true);
        expect(Object.keys(BASE.forms)).toStrictEqual(["guide"]);
    });
});
