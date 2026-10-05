import { mkdirSync, mkdtempSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const PREFIX = "govlab-prune-";

const FILES: readonly (readonly [string, string])[] = [
    ["index.html", '<script src="/assets/app.js"></script><img src="/assets/hero.png">'],
    ["assets/app.js", 'fetch("/assets/data/index.json");import("./page.js");import("../json/home.json")'],
    ["assets/app.js.gz", ""],
    ["assets/page.js", 'import{a}from"./shared.js"'],
    ["assets/shared.js", "export const a = 1;"],
    ["assets/stale.js", "export const b = 2;"],
    ["assets/data/index.json", '{"url":"/assets/data/files/one.txt"}'],
    ["assets/data/files/one.txt", "one"],
    ["assets/data/files/two.txt", "two"],
    ["assets/hero.png", "png"],
    ["assets/orphan.mp4", "mp4"],
    ["json/home.json", "{}"],
    ["robots.txt", "User-agent: *"],
];

export const UNREFERENCED: readonly string[] = ["assets/data/files/two.txt", "assets/orphan.mp4", "assets/stale.js"];

export const builtOutput = function builtOutput(): string {
    const outDir = mkdtempSync(join(tmpdir(), PREFIX));
    for (const [path, content] of FILES) {
        const target = join(outDir, ...path.split("/"));
        mkdirSync(join(target, ".."), { recursive: true });
        writeVerbatim(target, content);
    }
    return outDir;
};
