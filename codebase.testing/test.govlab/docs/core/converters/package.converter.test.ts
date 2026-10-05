import { describe, expect, it } from "vitest";
import { scriptLifecycle } from "@govlab/docs/core/converters/package.converter.ts";

const graph = scriptLifecycle({
    build: "npm run build:frontend && npm run build:backend",
    "build:backend": "tsc -b",
    "build:frontend": "vite build",
    ci: "run-s build verify",
    dev: 'concurrently "npm run dev:vite" "npm run dev:server"',
    "dev:server": "nodemon server.js",
    "dev:vite": "vite",
    verify: "node verify.ts",
});

const linked = function linked(from: string, to: string): boolean {
    return graph.edges.some((edge) => edge.from === from && edge.to === to);
};

describe("scriptLifecycle", () => {
    it("resolves package runs, quoted sub-commands and run-all references", () => {
        expect(linked("script:build", "script:build:frontend")).toBe(true);
        expect(linked("script:build", "script:build:backend")).toBe(true);
        expect(linked("script:dev", "script:dev:vite")).toBe(true);
        expect(linked("script:dev", "script:dev:server")).toBe(true);
        expect(linked("script:ci", "script:build")).toBe(true);
        expect(linked("script:ci", "script:verify")).toBe(true);
    });

    it("resolves a file a runner executes and the tool a leaf script calls", () => {
        expect(linked("script:verify", "file:verify.ts")).toBe(true);
        expect(linked("script:build:frontend", "tool:vite")).toBe(true);
    });
});
