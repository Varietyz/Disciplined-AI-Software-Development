import { mkdirSync, mkdtempSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const MANIFEST = '{ "files": ["README.md", "tools", "absent.md"] }\n';

export const seeded = function seeded(): string {
    const root = mkdtempSync(join(tmpdir(), "coordination-"));
    mkdirSync(join(root, "member", "tools", "fixtures"), { recursive: true });
    mkdirSync(join(root, "member", "_generated"), { recursive: true });
    mkdirSync(join(root, "public"), { recursive: true });
    writeVerbatim(join(root, "member", "package.json"), MANIFEST);
    writeVerbatim(join(root, "member", "README.md"), "readme\n");
    writeVerbatim(join(root, "member", "tools", "fixtures", "a.fixture.ts"), "fixture\n");
    writeVerbatim(join(root, "member", "_generated", "report.generated.json"), "{}\n");
    writeVerbatim(join(root, "public", "stale.md"), "stale\n");
    return root;
};
