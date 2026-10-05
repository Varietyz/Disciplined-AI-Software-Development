import { describe, expect, it } from "vitest";
import { evidenceFor, subjectMatches } from "@banes-lab/web/domain/converters/evidence.converter.ts";
import { EVIDENCE } from "@banes-lab/web/configuration/constants/evidence.source.constants.ts";

const REGISTRY_REF = "architecture:registry-pattern";

describe("evidenceFor", () => {
    it("finds the registry entry that grounds an ontology record", () => {
        const target = { face: REGISTRY_REF.slice(0, REGISTRY_REF.indexOf(":")), ref: REGISTRY_REF };
        expect(subjectMatches({ kind: "record", ref: REGISTRY_REF }, target)).toBe(true);
        expect(evidenceFor(target, EVIDENCE)).toHaveLength(1);
    });
});
