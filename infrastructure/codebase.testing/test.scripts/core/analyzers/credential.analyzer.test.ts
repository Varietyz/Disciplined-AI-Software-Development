import { describe, expect, it } from "vitest";
import { credentialFindings } from "@project/scripts/core/analyzers/credential.analyzer.ts";
import { loadDetectors } from "@ssot/secrets";

describe("credentialFindings", () => {
    it("reports the line and kind of a secret-shaped token, and passes prose", async () => {
        const detectors = await loadDetectors();
        const address = ["203", "0", "113", "7"].join(".");
        const text = ["a line of prose", `host: "${address}"`, "another line"].join("\n");
        expect(credentialFindings("a.yaml", text, detectors)).toStrictEqual([
            { file: "a.yaml", kind: "address", line: 2 },
        ]);
        expect(credentialFindings("b.md", "nothing secret here", detectors)).toStrictEqual([]);
    });
});
