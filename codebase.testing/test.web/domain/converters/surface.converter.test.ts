import { describe, expect, it } from "vitest";
import { transcriptOf } from "@banes-lab/web/domain/converters/surface.converter.ts";

describe("transcriptOf", () => {
    it("writes each command after the prompt mark, its output below it, and a blank line between frames", () => {
        const transcript = transcriptOf({
            figure: "wait",
            frames: [
                { command: "npm run await -- --agent A", lines: [], output: "WAITING\n  for B\n", surface: "board.md" },
                {
                    command: "npm run await -- --agent B",
                    lines: [],
                    output: "ITEM  B-1 was added.\n",
                    surface: "board.md",
                },
            ],
            inputs: "",
            opening: [],
        });
        expect(transcript).toBe(
            "$ npm run await -- --agent A\nWAITING\n  for B\n\n$ npm run await -- --agent B\nITEM  B-1 was added.",
        );
    });
});
