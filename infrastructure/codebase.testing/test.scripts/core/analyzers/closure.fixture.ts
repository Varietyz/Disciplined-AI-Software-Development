import { mkdirSync, mkdtempSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

export const ZONE = "zone";

const MANIFEST = { exports: { "./*": "./*" }, imports: { [`#${ZONE}/*`]: `./${ZONE}/*.ts` }, name: "@fixture/member" };

const CALLER = [
    `import { A_ID } from "#${ZONE}/a.ids";`,
    "registerThing({ id: A_ID });",
    "getThing(A_ID);",
    "emitEvent(A_ID);",
    "subscribeEvent({ event: A_ID });",
    "export interface Shape { name: string; age?: number }",
    "export function run(): void {}",
    `const label = (await import("#${ZONE}/b.strings")).LABEL;`,
    "",
].join("\n");

export const memberFixture = function memberFixture(): string {
    const root = mkdtempSync(join(tmpdir(), "closure-member-"));
    const zone = join(root, ZONE);
    mkdirSync(zone);
    writeVerbatim(join(root, "package.json"), JSON.stringify(MANIFEST));
    writeVerbatim(join(zone, "a.ids.ts"), 'export const A_ID = "a";\n');
    writeVerbatim(join(zone, "b.strings.ts"), 'export const LABEL = "label";\n');
    writeVerbatim(join(zone, "c.ts"), CALLER);
    writeVerbatim(join(zone, "index.ts"), 'export default import.meta.glob("./*.ids.ts");\n');
    writeVerbatim(join(zone, "c.test.ts"), "export const skipped = 1;\n");
    return root;
};
