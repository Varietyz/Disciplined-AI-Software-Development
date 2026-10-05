import { describe, expect, it } from "vitest";
import { errorLogOf, scriptNameOf, scriptTextOf } from "@banes-lab/deploy/core/converters/nginx.converter.ts";
import { ERROR_LOG_MISSING } from "@banes-lab/deploy/configuration/strings/deployment.strings.ts";
import { absolutePath } from "@ssot/paths";
import { join } from "node:path";
import { readFileSync } from "node:fs";

describe("scriptNameOf and scriptTextOf", () => {
    it("ships a TypeScript njs script as JavaScript named for its subject, with its types stripped", () => {
        expect(scriptNameOf("catalog.entrypoint.ts")).toBe("catalog.js");
        const text = scriptTextOf(
            "query.ts",
            "interface A { readonly b: number }\nexport const c = (d: A): number => d.b;\n",
        );
        expect(text).not.toContain("interface");
        expect(text).toContain("export const c = (d) => d.b;");
    });

    it("imports a built-in by the bare name njs registers, because njs has no node: protocol", () => {
        const text = scriptTextOf("query.ts", 'import fs from "node:fs";\nexport const e = fs;\n');
        expect(text).toContain('import fs from "fs";');
        expect(text).not.toContain("node:");
    });

    it("leaves no node: specifier in the shipped query script", () => {
        const name = "catalog.entrypoint.ts";
        const source = readFileSync(join(absolutePath("app.nginxScripts"), name), "utf8");
        expect(scriptTextOf(name, source)).not.toContain('"node:');
    });

    it("passes a file that is not TypeScript through unchanged", () => {
        expect(scriptNameOf("rules.conf")).toBe("rules.conf");
        expect(scriptTextOf("rules.conf", "a b;\n")).toBe("a b;\n");
    });
});

describe("errorLogOf", () => {
    it("reads the error log path from the first error_log directive, with or without a level", () => {
        expect(errorLogOf("server {\n    error_log /var/log/a.log warn;\n}\n")).toBe("/var/log/a.log");
        expect(errorLogOf("    error_log /var/log/b.log;\n")).toBe("/var/log/b.log");
    });

    it("finds the error log the site file declares", () => {
        const site = readFileSync(absolutePath("app.nginxSite"), "utf8");
        expect(errorLogOf(site).length).toBeGreaterThan(0);
    });

    it("refuses a site file that declares no error log", () => {
        expect(() => errorLogOf("server {\n    access_log off;\n}\n")).toThrow(ERROR_LOG_MISSING);
    });
});
