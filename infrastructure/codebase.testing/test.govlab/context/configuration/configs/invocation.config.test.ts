import { PAG_ARGV, RESOLUTION_ARGV, SYMBOLS_ARGV } from "@govlab/context/configuration/configs/invocation.config.ts";
import { absolutePath, relativePath } from "@ssot/paths";
import { ENTRYPOINT_FILES } from "@govlab/context/configuration/constants/invocation.constants.ts";
import assert from "node:assert/strict";
import { createGovlabContext } from "@govlab/context";
import path from "node:path";
import { readFileSync } from "node:fs";
import { test } from "vitest";

const HOST_TOKENS = [
    relativePath("app.root"),
    relativePath("codebase.testing"),
    relativePath("project.scripts"),
    relativePath("govlab.root"),
];

const OS_ABSOLUTE_MARKERS = ["C:\\", "D:\\", "/Users/", "/home/", "/root/"];

const readEntrypoint = (name: string): string =>
    readFileSync(path.join(absolutePath("govlab.context.entrypoints"), name), "utf8");

test("the host-agnostic context the entry points compose builds with no consumer config", () => {
    const context = createGovlabContext();
    assert.equal(typeof context.validateResolution, "function");
    assert.ok(context.kindTaxonomy().length > 0);
});

test("each argv contract names the entry point file it runs", () => {
    assert.ok(RESOLUTION_ARGV.command.includes(ENTRYPOINT_FILES.ontology));
    assert.ok(PAG_ARGV.command.includes(ENTRYPOINT_FILES.grammar));
    assert.ok(SYMBOLS_ARGV.command.includes(ENTRYPOINT_FILES.algorithm));
});

for (const name of Object.values(ENTRYPOINT_FILES)) {
    test(`${name} spells no consuming-host token and no OS-absolute path`, () => {
        const source = readEntrypoint(name);
        for (const token of [...HOST_TOKENS, ...OS_ABSOLUTE_MARKERS]) {
            assert.ok(!source.includes(token), `${name} spells "${token}"`);
        }
    });
}
