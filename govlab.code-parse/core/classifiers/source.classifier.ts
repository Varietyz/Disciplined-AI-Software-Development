import {
    EXTENSION_DOT,
    SHEBANG_PREFIX,
    SHEBANG_TOKENS,
    UNDECLARED_EXTENSIONS,
} from "#configuration/constants/source.constants";
import { loadDerivedExtensions } from "#core/loaders/source.loader";

const buildExtensions = function buildExtensions(): ReadonlyMap<string, string> {
    const map = loadDerivedExtensions();
    for (const [extension, language] of UNDECLARED_EXTENSIONS) {
        if (!map.has(extension)) {
            map.set(extension, language);
        }
    }
    return map;
};

const EXTENSIONS = buildExtensions();

const extensionOf = function extensionOf(filename: string): string {
    const dot = filename.lastIndexOf(EXTENSION_DOT);
    return dot === -1 ? "" : filename.slice(dot).toLowerCase();
};

const firstLine = function firstLine(content: string): string {
    const newline = content.indexOf("\n");
    return (newline === -1 ? content : content.slice(0, newline)).toLowerCase();
};

const fromShebang = function fromShebang(content: string): string | null {
    if (!content.startsWith(SHEBANG_PREFIX)) {
        return null;
    }
    const line = firstLine(content);
    for (const [token, language] of SHEBANG_TOKENS) {
        if (line.includes(token)) {
            return language;
        }
    }
    return null;
};

export const detectLanguage = function detectLanguage(filename: string, content = ""): string | null {
    const byExtension = EXTENSIONS.get(extensionOf(filename));
    return typeof byExtension === "string" ? byExtension : fromShebang(content);
};

export const DETECTABLE_LANGUAGES: ReadonlySet<string> = new Set([...EXTENSIONS.values(), ...SHEBANG_TOKENS.values()]);
