import {
    ENGINE_DIRECTIVE,
    IMPORT_DIRECTIVE,
    REQUIRED_ENGINE,
    TERMINATOR,
} from "#configuration/constants/nginx.constants";

export const commentsHeld = function commentsHeld(count: number): string {
    return `[config-comments] ${String(count)} server configuration file(s) carry no comment\n`;
};

export const commentsHeading = function commentsHeading(count: number): string {
    return `[config-comments] ${String(count)} comment line(s) in the server configuration:`;
};

export const COMMENT_REMEDY =
    "  A configuration file states directives only. Delete the comment, and record a non-obvious reason in the server member's manifest.";

export const engineHeld = function engineHeld(count: number): string {
    return `[config-engine] ${String(count)} server configuration file(s) checked, and every one that imports an njs script selects ${REQUIRED_ENGINE}\n`;
};

export const engineHeading = function engineHeading(count: number): string {
    return `[config-engine] ${String(count)} server configuration file(s) do not select the script engine:`;
};

export const ENGINE_MISSING = `imports an njs script and declares no ${ENGINE_DIRECTIVE}`;

export const otherEngine = function otherEngine(engine: string): string {
    return `declares ${ENGINE_DIRECTIVE} ${engine}`;
};

export const ENGINE_REMEDY = `  The njs scripts are written and tested against a full ECMAScript engine, and the default njs engine lacks built-ins such as Map. Add the directive "${ENGINE_DIRECTIVE} ${REQUIRED_ENGINE}${TERMINATOR}" beside the ${IMPORT_DIRECTIVE}.`;
