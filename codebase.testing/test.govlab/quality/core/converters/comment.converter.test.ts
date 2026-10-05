import { beforeAll, describe, expect, it } from "vitest";
import { extractComments, stripComments } from "@govlab/quality/core/converters/comment.converter.ts";
import type { CommentGrammar } from "@govlab/quality/types/comment.types.ts";
import { commentGrammars } from "@govlab/quality/core/loaders/comment.loader.ts";
import { ensureLanguages } from "@govlab/code-parse";

const defined = function defined<T>(value: T | undefined): T {
    if (value === undefined) {
        throw new TypeError("expected a defined value");
    }
    return value;
};

const grammars = commentGrammars();
const go = defined(grammars.get("go"));
const ts = defined(grammars.get("typescript"));
const py = defined(grammars.get("python"));

const clean = function clean(grammar: CommentGrammar, content: string): string {
    return stripComments(content, grammar).content;
};

const changed = function changed(grammar: CommentGrammar, content: string): boolean {
    return stripComments(content, grammar).changed;
};

const cleanLang = function cleanLang(lang: string, content: string): { changed: boolean; content: string } {
    return stripComments(content, grammars.get(lang) ?? { directivePrefixes: [], lang });
};

beforeAll(async () => {
    await ensureLanguages(["go", "python", "lua", "css", "java", "sql", "typescript", "tsx", "javascript", "c_sharp"]);
});

describe("comment converter — known-good removals", () => {
    it("removes an own-line line comment including its whole line", () => {
        expect(clean(go, "// header\ncode")).toBe("code");
    });

    it("removes an inline line comment and the whitespace before it, keeping the code", () => {
        expect(clean(go, "x := 1 // trailing")).toBe("x := 1");
    });

    it("removes an inline block comment, keeping the code on both sides", () => {
        expect(clean(ts, "a /* mid */ b")).toBe("a b");
    });

    it("removes a Python line comment", () => {
        expect(clean(py, "x = 1  # note")).toBe("x = 1");
    });
});

describe("comment converter — load-bearing directive preservation (never removed)", () => {
    it("keeps a Go build directive", () => {
        expect(changed(go, "//go:build linux\npackage x")).toBe(false);
    });

    it("keeps a Go nolint directive", () => {
        expect(changed(go, "x := 1 //nolint:errcheck")).toBe(false);
    });

    it("keeps a Python shebang", () => {
        expect(changed(py, "#!/usr/bin/env python\nx = 1")).toBe(false);
    });

    it("keeps a TS vitest per-file environment pragma", () => {
        const pragma = `// @vitest-environment jsdom`;
        expect(changed(ts, `${pragma}\nconst x = 1;`)).toBe(false);
    });
});

describe("comment converter — escape hatches stripped (zero tolerance, no litter surface)", () => {
    it("strips a TS eslint-disable directive", () => {
        expect(changed(ts, "// eslint-disable-next-line\nconst x = 1;")).toBe(true);
    });

    it("strips a TS @ts- suppression", () => {
        expect(changed(ts, "// @ts-ignore\nconst x = 1;")).toBe(true);
    });

    it("strips a TS /// triple-slash reference — same rule as any comment", () => {
        expect(changed(ts, '/// <reference types="node" />\nconst x = 1;')).toBe(true);
    });

    it("strips a Python type/noqa suppression", () => {
        expect(changed(py, "x = 1  # type: ignore")).toBe(true);
        expect(changed(py, "import os  # noqa")).toBe(true);
    });
});

describe("comment converter — license-header preservation (cross-language)", () => {
    it("keeps a Go SPDX + copyright header", () => {
        expect(changed(go, "// Copyright 2024 The Authors\n// SPDX-License-Identifier: MIT\npackage x")).toBe(false);
    });

    it("keeps a TS copyright block", () => {
        expect(changed(ts, "/* Copyright 2024 */\nconst x = 1;")).toBe(false);
    });
});

describe("comment converter — adversarial false-positive guards (MUST NOT corrupt)", () => {
    it("does not strip a // that lives inside a double-quoted string (URL)", () => {
        expect(changed(go, 'u := "https://x.com//y"')).toBe(false);
    });

    it("does not strip a // inside a Go raw string (backticks)", () => {
        expect(changed(go, "s := `a//b`")).toBe(false);
    });

    it("does not strip a // inside a TS template literal", () => {
        expect(changed(ts, "const t = `x //y z`;")).toBe(false);
    });

    it("does not strip a # inside a Python string", () => {
        expect(changed(py, 's = "a#b"')).toBe(false);
    });

    it("respects an escaped quote — the // after it is still inside the string", () => {
        expect(changed(ts, String.raw`const s = "a\"//b";`)).toBe(false);
    });

    it("does not see a phantom comment when a block-close */ lives inside a string", () => {
        expect(changed(ts, 'const s = "*/";')).toBe(false);
    });

    it("does not let a quote inside a comment open a string that eats the next line", () => {
        expect(clean(go, 'x := 1 // "unclosed\ny := 2')).toBe("x := 1\ny := 2");
    });

    it("does not treat a unicode homoglyph of / as a comment delimiter", () => {
        expect(changed(ts, "let a = 1; ⁄⁄ fake")).toBe(false);
    });

    it("preserves a Python triple-quoted docstring containing a #", () => {
        expect(changed(py, 'x = """\n# not a comment\n"""')).toBe(false);
    });

    it("treats a string delimiter inside a line comment as comment text, not a literal", () => {
        expect(clean(go, "a := 1 // it's fine\nb := 2")).toBe("a := 1\nb := 2");
    });

    it("does not mistake a // or /* INSIDE a regex literal for a comment", () => {
        const src = String.raw`const s = src.replace(/\/\*[\s\S]*?\*\//g, ""); // strip`;
        expect(clean(ts, src)).toBe(String.raw`const s = src.replace(/\/\*[\s\S]*?\*\//g, "");`);
    });

    it("does not strip comment delimiters inside a regex character class", () => {
        expect(changed(ts, String.raw`const c = x.replace(/[/*]+/g, "-");`)).toBe(false);
    });

    it("treats a division / as division, not a regex, so a later comment still strips", () => {
        expect(clean(ts, "const r = total / count; // ratio")).toBe("const r = total / count;");
    });

    it("skips a regex in expression position after an open paren", () => {
        expect(changed(ts, String.raw`if (/a\/b/.test(u)) run();`)).toBe(false);
    });

    it("skips a regex preceded by a keyword like return", () => {
        expect(changed(ts, String.raw`function f() { return /x\/\/y/.source; }`)).toBe(false);
    });
});

describe("comment converter — cross-language syntaxes", () => {
    it("strips comments across comment syntaxes, keeping code", () => {
        expect(cleanLang("go", "code // kill").content).toBe("code");
        expect(cleanLang("python", "code  # kill").content).toBe("code");
        expect(cleanLang("lua", "code -- kill").content).toBe("code");
        expect(cleanLang("css", ".a { color: red; /* kill */ }").changed).toBe(true);
    });

    it("never strips a comment marker that lives inside a string, in any syntax", () => {
        expect(cleanLang("go", 'x := "a // b"').changed).toBe(false);
        expect(cleanLang("python", 's = "a # b"').changed).toBe(false);
        expect(cleanLang("lua", 'x = "a -- b"').changed).toBe(false);
        expect(cleanLang("sql", "SELECT 'a -- b'").changed).toBe(false);
    });

    it("preserves only load-bearing directives; a doc comment is stripped like any comment", () => {
        expect(cleanLang("go", "//go:build linux\npackage x").changed).toBe(false);
        expect(cleanLang("java", "/** api */\nclass X {}").changed).toBe(true);
    });

    it("strips every comment for a language with no policy row (c_sharp, css, sql)", () => {
        expect(cleanLang("c_sharp", "/// doc\nclass X {}").changed).toBe(true);
        expect(cleanLang("css", ".a { /* note */ color: red; }").changed).toBe(true);
    });
});

describe("comment converter — stability", () => {
    it("is idempotent: cleaning twice equals cleaning once", () => {
        const src = "// a\ncode /* b */ more // c\ntail";
        const once = clean(go, src);
        expect(clean(go, once)).toBe(once);
    });

    it("is a no-op on code with no comments", () => {
        expect(changed(go, "package x\n\nfunc main() {}\n")).toBe(false);
    });
});

describe("comment converter — extractComments", () => {
    it("returns the removable comments and the stripped content", () => {
        const result = extractComments("// header\ncode", go);
        expect(result.changed).toBe(true);
        expect(result.content).toBe("code");
        expect(result.comments.map((comment) => comment.text)).toEqual(["// header"]);
    });
});
