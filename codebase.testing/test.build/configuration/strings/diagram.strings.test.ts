import {
    NO_BROWSER,
    NO_STAGE_PORT,
    STAGE_NOT_READY,
    diagramFailed,
    diagramRelaunch,
    diagramStalled,
    diagramsLine,
    noEndpoint,
    noMarkup,
    stageThrew,
    undeclaredToken,
} from "@banes-lab/build-scripts/configuration/strings/diagram.strings.ts";
import { describe, expect, it } from "vitest";

describe("noEndpoint and diagramsLine", () => {
    it("name the browser state when no endpoint was written, and the count and folder of a render", () => {
        expect(noEndpoint("chrome", "profile", null)).toContain("the browser was still running");
        expect(noEndpoint("chrome", "profile", 1)).toContain("had exited with code 1");
        expect(diagramsLine(2, "diagrams")).toBe("diagrams: rendered 2 diagram(s) into diagrams\n");
    });
});

describe("the diagram render errors", () => {
    it("name the diagram, the token or the stage state each failure is about", () => {
        expect([STAGE_NOT_READY, NO_BROWSER, NO_STAGE_PORT].every((text) => text.startsWith("diagram"))).toBe(true);
        expect(stageThrew("boom")).toBe("diagram: the stage threw: boom");
        expect(diagramFailed(3, "flowchart TD", "boom")).toBe("diagram 3 (flowchart TD): boom");
        expect(noMarkup(3)).toContain("no markup for diagram 3");
        expect(diagramStalled(3, "flowchart TD", 3)).toContain(
            "diagram 3 (flowchart TD): the browser stopped answering",
        );
        expect(diagramRelaunch(3, "no reply")).toContain("relaunching it to resume there");
        expect(undeclaredToken("--ink")).toContain("the token --ink is not declared");
    });
});
