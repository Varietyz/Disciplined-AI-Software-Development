import type { Rule } from "eslint";
import { packageRootOf } from "#core/resolvers/package.resolver";

const MESSAGE =
    "Package source must be OS-agnostic outside a package's own src/platform/ folder. " +
    "This construct hardcodes one operating system, so the package breaks on a Windows, macOS, or Linux host. " +
    "Move deterministic all-OS variation into this package's src/platform/ folder, " +
    "and build paths with path.join / path.sep rather than hardcoded separators or drive letters. [platform_agnostic_surface]";

const DRIVE_MIN = 3;

const PLATFORM_STRINGS = new Set([
    "win32",
    "darwin",
    "linux",
    "freebsd",
    "openbsd",
    "netbsd",
    "sunos",
    "aix",
    "android",
    "cygwin",
    "haiku",
]);

const EXEC_CALLEES = new Set(["exec", "execSync", "execFile", "execFileSync", "spawn", "spawnSync"]);

const OS_BOUND_COMMANDS = new Set([
    "wmic",
    "powershell",
    "powershell.exe",
    "cmd",
    "cmd.exe",
    "reg",
    "reg.exe",
    "netsh",
    "sc",
    "tasklist",
    "wevtutil",
    "system_profiler",
    "sw_vers",
    "diskutil",
    "defaults",
    "launchctl",
    "scutil",
    "pmset",
    "lspci",
    "lsblk",
    "lscpu",
    "dmidecode",
    "systemctl",
    "journalctl",
    "dpkg",
    "apt",
    "apt-get",
    "yum",
]);

const COMPARISON_OPERATORS = new Set(["===", "!==", "==", "!="]);
const REPORT_SELECTORS = ["BinaryExpression", "CallExpression", "Literal", "SwitchCase"];

interface StringNode {
    type?: string;
    value?: unknown;
    expressions?: unknown[];
    quasis?: { value?: { cooked?: string } }[];
}

interface CalleeNode {
    type?: string;
    name?: string;
    property?: { name?: string };
}

const isStringNode = function isStringNode(node: unknown): node is StringNode {
    return typeof node === "object" && node !== null;
};

const isCalleeNode = function isCalleeNode(node: unknown): node is CalleeNode {
    return typeof node === "object" && node !== null;
};

const isExemptFile = function isExemptFile(filename: string): boolean {
    const normalized = filename.replaceAll("\\", "/");
    if (normalized.includes("/src/platform/") || normalized.endsWith("/src/platform.ts")) {
        return true;
    }
    return normalized.endsWith(".test.ts") || normalized.includes("/tests/");
};

const literalString = function literalString(node: StringNode): string | null {
    return node.type === "Literal" && typeof node.value === "string" ? node.value : null;
};

const templateString = function templateString(node: StringNode): string | null {
    if (node.type !== "TemplateLiteral" || (node.expressions?.length ?? 0) !== 0 || node.quasis?.length !== 1) {
        return null;
    }
    return node.quasis[0]?.value?.cooked ?? null;
};

const staticStringValue = function staticStringValue(node: unknown): string | null {
    if (!isStringNode(node)) {
        return null;
    }
    return literalString(node) ?? templateString(node);
};

const isPlatformStringLiteral = function isPlatformStringLiteral(node: unknown): boolean {
    const value = staticStringValue(node);
    return value !== null && PLATFORM_STRINGS.has(value);
};

const commandBasename = function commandBasename(token: string): string {
    const cut = Math.max(token.lastIndexOf("/"), token.lastIndexOf("\\"));
    return cut === -1 ? token : token.slice(cut + 1);
};

const firstToken = function firstToken(command: string): string {
    const trimmed = command.trim();
    let end = 0;
    while (end < trimmed.length && trimmed[end] !== " " && trimmed[end] !== "\t") {
        end += 1;
    }
    return trimmed.slice(0, end);
};

const isOsBoundCommand = function isOsBoundCommand(node: unknown): boolean {
    const value = staticStringValue(node);
    if (value === null) {
        return false;
    }
    const first = firstToken(value);
    return first !== "" && OS_BOUND_COMMANDS.has(commandBasename(first).toLowerCase());
};

const isAsciiLetter = function isAsciiLetter(ch: string): boolean {
    return (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z");
};

const isDriveLetterPath = function isDriveLetterPath(value: string): boolean {
    if (value.length < DRIVE_MIN || !isAsciiLetter(value[0] ?? "") || value[1] !== ":") {
        return false;
    }
    const sep = value[DRIVE_MIN - 1];
    return sep === "\\" || sep === "/";
};

const calleeName = function calleeName(callee: unknown): string | null {
    if (!isCalleeNode(callee)) {
        return null;
    }
    if (callee.type === "Identifier") {
        return callee.name ?? null;
    }
    if (callee.type === "MemberExpression") {
        return callee.property?.name ?? null;
    }
    return null;
};

const onBinary = function onBinary(node: Rule.Node, report: (n: Rule.Node) => void): void {
    if (node.type !== "BinaryExpression" || !COMPARISON_OPERATORS.has(node.operator)) {
        return;
    }
    if (isPlatformStringLiteral(node.left) || isPlatformStringLiteral(node.right)) {
        report(node);
    }
};

const onCall = function onCall(node: Rule.Node, report: (n: Rule.Node) => void): void {
    if (node.type !== "CallExpression") {
        return;
    }
    const name = calleeName(node.callee);
    const [first] = node.arguments;
    if (name !== null && EXEC_CALLEES.has(name) && first && isOsBoundCommand(first)) {
        report(node);
    }
};

const onLiteral = function onLiteral(node: Rule.Node, report: (n: Rule.Node) => void): void {
    if (node.type === "Literal" && typeof node.value === "string" && isDriveLetterPath(node.value)) {
        report(node);
    }
};

const onSwitchCase = function onSwitchCase(node: Rule.Node, report: (n: Rule.Node) => void): void {
    if (node.type !== "SwitchCase" || !node.test) {
        return;
    }
    if (isPlatformStringLiteral(node.test)) {
        report(node);
    }
};

const HANDLERS = [onBinary, onCall, onLiteral, onSwitchCase];

const listenersFor = function listenersFor(context: Rule.RuleContext): Rule.RuleListener {
    const report = (node: Rule.Node): void => {
        context.report({ messageId: "platformCoupling", node });
    };
    const listeners: Rule.RuleListener = {};
    REPORT_SELECTORS.forEach((selector, i) => {
        listeners[selector] = (node: Rule.Node): void => {
            HANDLERS[i]?.(node, report);
        };
    });
    return listeners;
};

export default {
    create(context): Rule.RuleListener {
        if (packageRootOf(context.filename) === null || isExemptFile(context.filename)) {
            return {};
        }
        return listenersFor(context);
    },

    meta: {
        docs: {
            description:
                "Disallow OS-coupled constructs (platform-string branches, OS-bound shell commands, drive-letter paths) in workspace source outside a package's own src/platform/ folder — packages must drop into any of Windows, macOS, or Linux.",
        },
        messages: { platformCoupling: MESSAGE },
        schema: [],
        type: "problem",
    },
} satisfies Rule.RuleModule;
