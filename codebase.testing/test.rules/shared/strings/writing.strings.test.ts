import {
    LAYER_TITLES,
    REGISTER_HEADER,
    REGISTER_MATCHES,
    documentFinding,
    findingsLine,
    recordFinding,
    registerDrift,
    renderedLine,
} from "@ssot/govlab/shared/strings/writing.strings.ts";
import { describe, expect, it } from "vitest";

describe("the writing canon lines", () => {
    it("open the register with its title and report what the render and the check found", () => {
        expect(REGISTER_HEADER[0]).toBe("# Register: how every string is written");
        expect(new Set(Object.values(LAYER_TITLES)).size).toBe(Object.keys(LAYER_TITLES).length);
        expect(REGISTER_MATCHES).toContain("the register matches the records");
        expect(recordFinding("root.x", "root.y", "no-filler-phrase", "note that", "Note that it runs.")).toContain(
            "the record breaks root.y, a no-filler-phrase finding",
        );
        expect(documentFinding("a.md", "root.y", "no-filler-phrase", "note that", "Note that it runs.")).toContain(
            "the text breaks root.y",
        );
        expect(registerDrift("register.md")).toContain("register.md: the register differs");
        expect(renderedLine(2, 9, "register.md")).toContain("rendered 2 layer(s) and 9 rule(s) into register.md");
        expect(findingsLine(0, 1)).toContain("0 record finding(s), 1 document finding(s)");
    });
});
