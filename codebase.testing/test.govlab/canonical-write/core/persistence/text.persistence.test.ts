import { describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync, statSync, utimesSync } from "node:fs";
import {
    parseMark,
    writeCanonicalJson,
    writeCanonicalText,
    writeGeneratedMarkdown,
    writeVerbatim,
} from "@govlab/canonical-write";
import { join } from "node:path";
import { tmpdir } from "node:os";

const withTempFile = async function withTempFile(
    name: string,
    run: (target: string) => Promise<void>,
): Promise<string> {
    const dir = mkdtempSync(join(tmpdir(), "canonical-write-"));
    const target = join(dir, name);
    try {
        await run(target);
        return readFileSync(target, "utf8");
    } finally {
        rmSync(dir, { force: true, recursive: true });
    }
};

describe("writeCanonicalJson", () => {
    it("writes prettier-normalized JSON with a trailing newline", async (): Promise<void> => {
        const text = await withTempFile("out.json", async (target): Promise<void> =>
            writeCanonicalJson(target, { a: "y", b: "x" }, { parser: "json" }),
        );
        expect(text).toContain('"a": "y"');
        expect(text.endsWith("\n")).toBe(true);
        expect(JSON.parse(text)).toEqual({ a: "y", b: "x" });
    });
});

describe("writeCanonicalText", () => {
    it("formats an already-serialized string by parser", async (): Promise<void> => {
        const text = await withTempFile("out.json", async (target): Promise<void> =>
            writeCanonicalText(target, '{"a":"y"}', { parser: "json" }),
        );
        expect(text).toContain('"a": "y"');
        expect(text.endsWith("\n")).toBe(true);
    });

    it("writes text the formatter cannot parse unchanged", async (): Promise<void> => {
        const text = await withTempFile("out.svg", async (target): Promise<void> =>
            writeCanonicalText(target, "<svg  />"),
        );
        expect(text).toBe("<svg  />");
    });
});

describe("writeGeneratedMarkdown", () => {
    it("formats before stamping, so a second write of the same text keeps its version", async (): Promise<void> => {
        const text = await withTempFile("out.md", async (target): Promise<void> => {
            await writeGeneratedMarkdown(target, "# Title\n\n\n\nFirst fact.");
            const first = readFileSync(target, "utf8");
            await writeGeneratedMarkdown(target, "# Title\n\n\n\nFirst fact.");
            expect(readFileSync(target, "utf8")).toBe(first);
        });
        expect(parseMark(text)?.version).toBe(1);
    });
});

describe("unchanged content", () => {
    it("leaves a file untouched when every writer is handed what it already holds", async (): Promise<void> => {
        const settled = new Date(2000, 0, 1);
        const untouched = async function untouched(
            name: string,
            write: (target: string) => Promise<void>,
        ): Promise<string> {
            return withTempFile(name, async (target): Promise<void> => {
                await write(target);
                utimesSync(target, settled, settled);
                await write(target);
                expect(statSync(target).mtimeMs).toBe(settled.getTime());
            });
        };
        await untouched("out.json", async (target) => writeCanonicalText(target, '{"a":"y"}', { parser: "json" }));
        await untouched("out.md", async (target) => writeGeneratedMarkdown(target, "# Title\n\nFirst fact."));
        await untouched("out.log", async (target) => {
            await Promise.resolve();
            writeVerbatim(target, "a  b\n");
        });
    });

    it("still writes content that differs from what the file holds", async (): Promise<void> => {
        const text = await withTempFile("out.json", async (target): Promise<void> => {
            await writeCanonicalText(target, '{"a":"y"}', { parser: "json" });
            await writeCanonicalText(target, '{"a":"z"}', { parser: "json" });
        });
        expect(JSON.parse(text)).toEqual({ a: "z" });
    });
});

describe("writeVerbatim", () => {
    it("writes text and bytes exactly as given", async (): Promise<void> => {
        const text = await withTempFile("out.log", async (target): Promise<void> => {
            await Promise.resolve();
            writeVerbatim(target, "a  b\n");
        });
        expect(text).toBe("a  b\n");
        const bytes = await withTempFile("out.bin", async (target): Promise<void> => {
            await Promise.resolve();
            writeVerbatim(target, Uint8Array.of(65, 66));
        });
        expect(bytes).toBe("AB");
    });
});
