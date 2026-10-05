import {
    INDEX_ENTRY_MARK,
    MARKDOWN_EXTENSION,
    MEMORY_FOLDER,
    MEMORY_INDEX,
    MEMORY_PROJECTS,
    SLUG_CHARS,
    SLUG_FILL,
    TYPE_KEY,
    UNSPECIFIED_TYPE,
} from "@govlab/stats/configuration/constants/agent.constants.ts";
import { collectMemory, memoryDirOf } from "@govlab/stats/core/loaders/agent.loader.ts";
import { describe, expect, it } from "vitest";
import { BARE } from "./stats.fixture.ts";

describe("collectMemory", () => {
    it("reports absence, and names the folder it looked in, when there is no memory folder", () => {
        const stats = collectMemory(BARE);
        expect(stats.present).toBe(false);
        expect(stats.files).toBe(0);
        expect(stats.dir).toBe(memoryDirOf(BARE));
    });

    it("builds the folder from the projects folder, a slug of the root and the memory folder", () => {
        const dir = memoryDirOf("a:b");
        expect(dir).toContain(MEMORY_PROJECTS);
        expect(dir.endsWith(MEMORY_FOLDER)).toBe(true);
        expect(dir).toContain(`a${SLUG_FILL}b`);
        expect(SLUG_CHARS.has(":")).toBe(false);
    });

    it("reads its markers from declared constants", () => {
        expect(MEMORY_INDEX.endsWith(MARKDOWN_EXTENSION)).toBe(true);
        expect(INDEX_ENTRY_MARK.startsWith("-")).toBe(true);
        expect(new Set([TYPE_KEY, UNSPECIFIED_TYPE]).size).toBe(2);
    });
});
