import { entriesAt, isRecord, numberAt, recordAt, textAt } from "#core/selectors/base.selector";
import type { ConsoleRecord } from "#types/browser.types";

const CONSOLE_METHOD = "Runtime.consoleAPICalled";
const EXCEPTION_METHOD = "Runtime.exceptionThrown";

export const EVENT_METHODS: ReadonlySet<string> = new Set([CONSOLE_METHOD, EXCEPTION_METHOD]);

const firstLine = function firstLine(text: string): string {
    return text.split("\n")[0] ?? "";
};

const locationOf = function locationOf(url: string | null, line: number | null): string {
    if (url === null || url.length === 0) {
        return "";
    }
    return line === null ? url : `${url}:${String(line + 1)}`;
};

const argText = function argText(arg: unknown): string {
    if (!isRecord(arg)) {
        return "";
    }
    const { value } = arg;
    if (typeof value === "string") {
        return value;
    }
    if (typeof value === "number" || typeof value === "boolean") {
        return String(value);
    }
    return firstLine(textAt(arg, "description") ?? "");
};

const firstCallFrame = function firstCallFrame(source: Record<string, unknown> | null): Record<string, unknown> | null {
    const trace = source === null ? null : recordAt(source, "stackTrace");
    const [frame] = trace === null ? [] : entriesAt(trace, "callFrames");
    return isRecord(frame) ? frame : null;
};

export const consoleRecord = function consoleRecord(params: Record<string, unknown> | null): ConsoleRecord {
    const frame = firstCallFrame(params);
    const args = params === null ? [] : entriesAt(params, "args");
    return {
        level: (params === null ? null : textAt(params, "type")) ?? "log",
        source: locationOf(
            frame === null ? null : textAt(frame, "url"),
            frame === null ? null : numberAt(frame, "lineNumber"),
        ),
        text: args.map(argText).join(" "),
    };
};

export const exceptionRecord = function exceptionRecord(details: Record<string, unknown>): ConsoleRecord {
    const thrown = recordAt(details, "exception");
    const described = firstLine((thrown === null ? null : textAt(thrown, "description")) ?? "");
    const frame = firstCallFrame(details);
    return {
        level: "exception",
        source: locationOf(
            textAt(details, "url") ?? (frame === null ? null : textAt(frame, "url")),
            numberAt(details, "lineNumber") ?? (frame === null ? null : numberAt(frame, "lineNumber")),
        ),
        text: described.length > 0 ? described : (textAt(details, "text") ?? ""),
    };
};

export const eventRecord = function eventRecord(parsed: Record<string, unknown>): ConsoleRecord | null {
    const method = textAt(parsed, "method");
    const params = recordAt(parsed, "params");
    if (method === CONSOLE_METHOD) {
        return consoleRecord(params);
    }
    const details = params === null ? null : recordAt(params, "exceptionDetails");
    return method === EXCEPTION_METHOD && details !== null ? exceptionRecord(details) : null;
};
