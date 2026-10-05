import { describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { bindingResolverOf } from "@banes-lab/build-scripts/core/resolvers/binding.resolver.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const CONFIG = JSON.stringify({
    compilerOptions: { allowImportingTsExtensions: true, module: "ESNext", moduleResolution: "Bundler", noEmit: true },
});
const B = "export const beta = 1;\nexport default function gamma() {\n    return beta;\n}\n";
const IMPORTS = 'import gamma, { beta as renamed } from "./b.ts";';
const NAMESPACE = 'import * as space from "./b.ts";';
const BODY = "const local = (value: number) => value + renamed + space.beta;";
const TAIL = 'export { beta } from "./b.ts";\nconst lazy = import("./b.ts");\nlocal(gamma());\nvoid lazy;\n';
const A = [IMPORTS, NAMESPACE, BODY, TAIL].join("\n");

describe("bindingResolverOf", () => {
    it("binds every identifier to its declaration through the compiler, across import forms and scopes", () => {
        const root = mkdtempSync(join(tmpdir(), "binding-"));
        writeVerbatim(join(root, "tsconfig.json"), CONFIG);
        writeVerbatim(join(root, "a.ts"), A);
        writeVerbatim(join(root, "b.ts"), B);
        const resolve = bindingResolverOf(
            [
                { absolute: join(root, "a.ts"), path: "a.ts" },
                { absolute: join(root, "b.ts"), path: "b.ts" },
                { absolute: join(root, "c.md"), path: "c.md" },
            ],
            root,
        );
        const bindings = resolve("a.ts") ?? [];
        const other = resolve("b.ts") ?? [];
        const prose = resolve("c.md");
        rmSync(root, { force: true, recursive: true });
        const at = (line: number, column: number): (typeof bindings)[number] | undefined =>
            bindings.find((binding) => binding.line === line && binding.column === column);
        const beta = { file: "b.ts", module: false, name: "beta", target: 1 };
        expect(at(1, IMPORTS.indexOf("gamma"))).toMatchObject({ file: "b.ts", name: "gamma", target: 2 });
        expect(at(1, IMPORTS.indexOf("renamed"))).toMatchObject(beta);
        expect(at(1, IMPORTS.indexOf('"'))).toMatchObject({ file: "b.ts", module: true });
        expect(at(2, NAMESPACE.indexOf("space"))).toMatchObject({ file: "b.ts", module: true });
        expect(at(3, BODY.lastIndexOf("value"))).toMatchObject({ file: "a.ts", name: "value", target: 3 });
        expect(at(3, BODY.indexOf("renamed"))).toMatchObject(beta);
        expect(at(3, BODY.indexOf("space."))).toMatchObject({ file: "b.ts", module: true });
        expect(at(3, BODY.indexOf("beta"))).toMatchObject(beta);
        expect(at(4, "export { ".length)).toMatchObject(beta);
        expect(at(5, "const lazy = import(".length)).toMatchObject({ file: "b.ts", module: true });
        expect(at(6, 0)).toMatchObject({ file: "a.ts", name: "local", target: 3 });
        expect(at(3, "const ".length)).toBeUndefined();
        expect(other.find((binding) => binding.line === 3)).toMatchObject({ file: "b.ts", name: "beta", target: 1 });
        expect(prose).toBeNull();
    });
});
