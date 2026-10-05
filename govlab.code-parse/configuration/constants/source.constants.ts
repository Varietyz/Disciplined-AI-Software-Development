export const UNDECLARED_EXTENSIONS: ReadonlyMap<string, string> = new Map([
    [".mts", "typescript"],
    [".cts", "typescript"],
    [".mli", "ocaml"],
    [".pyi", "python"],
    [".sc", "scala"],
    [".htm", "html"],
    [".edn", "clojure"],
    [".sql", "sql"],
]);

export const SHEBANG_TOKENS: ReadonlyMap<string, string> = new Map([
    ["python", "python"],
    ["node", "javascript"],
    ["deno", "javascript"],
    ["bash", "bash"],
    ["/sh", "bash"],
    ["zsh", "bash"],
    ["ruby", "ruby"],
    ["php", "php"],
    ["lua", "lua"],
    ["elixir", "elixir"],
]);

export const SHEBANG_PREFIX = "#!";

export const EXTENSION_DOT = ".";
