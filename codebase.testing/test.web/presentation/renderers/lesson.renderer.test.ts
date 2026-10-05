import { describe, expect, it } from "vitest";
import type { LessonBlock } from "@banes-lab/web/types/block.types.ts";
import { renderBlock } from "@banes-lab/web/presentation/renderers/block.renderer.ts";
import { renderLesson } from "@banes-lab/web/presentation/renderers/lesson.renderer.ts";

const LESSON: LessonBlock = {
    application: "application <em>text</em>",
    cause: "cause",
    decision: "decision",
    failureMode: "failure mode",
    kind: "lesson",
    principle: "principle",
    problem: "problem",
    validation: "validation",
};

const paragraphsOf = function paragraphsOf(element: Element): string[] {
    return [...element.querySelectorAll("p")].map((paragraph) => paragraph.textContent);
};

describe("renderLesson", () => {
    it("flows the fields into three unlabeled paragraphs, the concrete situation before the principle", () => {
        const rendered = renderLesson(LESSON);
        expect(paragraphsOf(rendered)).toStrictEqual([
            "problem failure mode cause",
            "principle decision application text",
            "validation",
        ]);
        expect(rendered.querySelector("strong")).toBeNull();
        expect(rendered.querySelector("em")).not.toBeNull();
    });

    it("closes the last paragraph with the boundary only when the lesson declares one", () => {
        expect(paragraphsOf(renderLesson({ ...LESSON, boundary: "when not" })).at(-1)).toBe("validation when not");
        expect(paragraphsOf(renderLesson({ ...LESSON, boundary: "when not" }))).toHaveLength(3);
        expect(paragraphsOf(renderLesson(LESSON))).toHaveLength(3);
    });
});

describe("renderBlock with a lesson", () => {
    it("dispatches to the lesson renderer rather than the composite fallback", () => {
        const rendered = renderBlock(LESSON);
        expect(rendered.classList.contains("block-lesson")).toBe(true);
        expect(rendered.querySelectorAll("p")).toHaveLength(3);
    });
});
