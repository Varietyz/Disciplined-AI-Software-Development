import {
    EXTERNAL_PLAINTEXT_ENDPOINTS,
    URL_SHAPED_IDENTIFIERS,
} from "@ssot/govlab/shared/manifests/identifier.manifest.ts";
import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import rule from "@ssot/govlab/rules/eslint/no-plaintext-transport.eslint.rule.ts";

const linter = new Linter();
const config = [
    {
        files: ["**/*.ts"],
        languageOptions: { ecmaVersion: 2025 as const, sourceType: "module" as const },
        plugins: { t: { rules: { r: rule } } },
        rules: { "t/r": "error" as const },
    },
];

const FILE = "sample.ts";

const idsFor = function idsFor(code: string): string[] {
    return linter
        .verify(code, config, FILE)
        .map((message) => message.messageId)
        .filter((id): id is string => typeof id === "string");
};

describe("no-plaintext-transport", () => {
    it("reports a plaintext URL in a literal and in a template", () => {
        expect(idsFor('const url = "http://127.0.0.1:4204/";')).toStrictEqual(["plaintextUrl"]);
        const templated = ["const url = `http://", "{host}:", "{port}/`;"].join("$");
        expect(idsFor(templated)).toStrictEqual(["plaintextUrl"]);
    });

    it("accepts only the exact template shape of a registered external endpoint", () => {
        const [shape] = [...EXTERNAL_PLAINTEXT_ENDPOINTS];
        expect(shape).toBe("ws://127.0.0.1:…/devtools/…");
        const registered = ["const url = `ws://127.0.0.1:", "{port}/devtools/", "{target}`;"].join("$");
        expect(idsFor(registered)).toStrictEqual([]);
        const elsewhere = ["const url = `ws://127.0.0.1:", "{port}/other/", "{target}`;"].join("$");
        expect(idsFor(elsewhere)).toStrictEqual(["plaintextUrl"]);
    });

    it("reports a plaintext socket URL and accepts the encrypted socket scheme", () => {
        const socket = ["const url = `ws://127.0.0.1:", "{port}/devtools`;"].join("$");
        expect(idsFor(socket)).toStrictEqual(["plaintextUrl"]);
        expect(idsFor('const url = "wss://127.0.0.1:4204/";')).toStrictEqual([]);
    });

    it("accepts the encrypted scheme and a bare scheme token used for classification", () => {
        expect(idsFor('const url = "https://127.0.0.1:4204/";')).toStrictEqual([]);
        expect(idsFor('const SCHEMES = ["http://", "https://"];')).toStrictEqual([]);
    });

    it("accepts a URL-shaped identifier the registry classifies, which is never fetched", () => {
        const [namespace] = [...URL_SHAPED_IDENTIFIERS];
        expect(namespace?.startsWith("http://")).toBe(true);
        expect(idsFor(`const NAMESPACE = ${JSON.stringify(namespace)};`)).toStrictEqual([]);
    });

    it("reports a server block that listens on a port without declaring encrypted transport", () => {
        expect(idsFor("const config = { server: { port: 4203, strictPort: true } };")).toStrictEqual([
            "plaintextListener",
        ]);
        expect(idsFor("const config = { server: listen ? { port: 4204 } : { middlewareMode: true } };")).toStrictEqual([
            "plaintextListener",
        ]);
    });

    it("accepts a server block that declares its transport, and one that does not listen", () => {
        expect(idsFor("const config = { server: { https: certificate, port: 4203 } };")).toStrictEqual([]);
        expect(idsFor("const config = { server: { middlewareMode: true } };")).toStrictEqual([]);
    });
});
