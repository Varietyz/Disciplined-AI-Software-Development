import { NOOP_LOGGER, debugLogger } from "@govlab/context/core/reporters/ontology.reporter.ts";
import { expect, test, vi } from "vitest";
import process from "node:process";

test("a disabled debug logger is the silent logger", () => {
    const write = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    expect(debugLogger(false)).toBe(NOOP_LOGGER);
    NOOP_LOGGER.warn("quiet");
    expect(write).not.toHaveBeenCalled();
    write.mockRestore();
});

test("an enabled debug logger writes each note to stderr under the package namespace", () => {
    const write = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    debugLogger(true).warn("loaded", { nodes: 2 });
    expect(write).toHaveBeenCalledWith('[govlab:context] loaded {"nodes":2}\n');
    write.mockRestore();
});
