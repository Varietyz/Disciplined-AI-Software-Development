export const CONFIG_EXTENSIONS: ReadonlySet<string> = new Set(["", ".conf"]);

export const COMMENT_MARK = "#";

export const ESCAPE = "\\";

export const QUOTES: ReadonlySet<string> = new Set(['"', "'"]);

export const TOKEN_BOUNDARIES: ReadonlySet<string> = new Set([" ", "\t", ";", "{", "}"]);

export const IMPORT_DIRECTIVE = "js_import";

export const ENGINE_DIRECTIVE = "js_engine";

export const REQUIRED_ENGINE = "qjs";

export const TERMINATOR = ";";
