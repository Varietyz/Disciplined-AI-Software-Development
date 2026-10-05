import {
    PACKAGES_REVERTED,
    PACKAGE_REVERT_UNAVAILABLE,
    PACKAGE_UNAVAILABLE,
    SERVER_CURRENT,
    SERVER_READY,
} from "@banes-lab/deploy/configuration/strings/nginx.strings.ts";
import {
    PACKAGE_SOURCES,
    SITE_LINK,
    SOURCE_MODULES,
} from "@banes-lab/deploy/configuration/constants/nginx.constants.ts";
import { describe, expect, it } from "vitest";
import { ensureServer, planPackages, prepareServer } from "@banes-lab/deploy/core/steps/setup.step.ts";
import { fakeJournal, fakeShell, ok } from "./shell.fixture.ts";
import type { CommandResult } from "@banes-lab/deploy/types/deployment.types.ts";
import { indexUrl } from "@banes-lab/deploy/core/converters/index.converter.ts";
import { markerOf } from "@banes-lab/deploy/core/steps/build.step.ts";

const [SERVER_SOURCE, BROTLI_SOURCE] = PACKAGE_SOURCES;
const PLATFORM = { architecture: "amd64", codename: "resolute" };

const stanza = function stanza(name: string, version: string, depends: string, provides = ""): string {
    return [
        `Package: ${name}`,
        `Version: ${version}`,
        `Depends: ${depends}`,
        `Provides: ${provides}`,
        `Filename: pool/${name}_${version}_amd64.deb`,
        `SHA256: sha-${name}-${version}`,
        "",
    ].join("\n");
};

const INDEXES = new Map([
    [
        indexUrl(SERVER_SOURCE ?? { base: "", component: "" }, "resolute", "amd64"),
        [
            stanza("nginx", "1.30.4-1~resolute", "libc6", "nginx, nginx-r1.30.4"),
            stanza("nginx-module-njs", "1.30.4+1.0.1-1~resolute", "libxml2-16, nginx-r1.30.4"),
        ].join("\n"),
    ],
    [
        indexUrl(SERVER_SOURCE ?? { base: "", component: "" }, "noble", "amd64"),
        stanza("nginx", "1.30.4-1~noble", "libc6", "nginx, nginx-r1.30.4"),
    ],
    [
        indexUrl(BROTLI_SOURCE ?? { base: "", component: "" }, "resolute", "amd64"),
        stanza("libnginx-mod-brotli", "1.1.0+nginx-1.30.4-1~resolute", "nginx (= 1.30.4-1~resolute)"),
    ],
    [
        indexUrl(BROTLI_SOURCE ?? { base: "", component: "" }, "noble", "amd64"),
        stanza("libnginx-mod-brotli", "1.1.0+nginx-1.30.4-1~noble", "nginx (= 1.30.4-1~noble)"),
    ],
]);

const fetchIndex = async (url: string): Promise<string> => {
    await Promise.resolve();
    return INDEXES.get(url) ?? "";
};

const status = function status(version: string): CommandResult {
    return ok(`Status: install ok installed\nVersion: ${version}`);
};

const MARKERS = SOURCE_MODULES.map(markerOf).join("\n");

interface Server {
    readonly installed: ReadonlyMap<string, string>;
    readonly marker: string;
    readonly testFails?: boolean;
}

const MIGRATING: Server = {
    installed: new Map([
        ["nginx", "1.30.4-1~noble"],
        ["libnginx-mod-brotli", "1.1.0+nginx-1.30.4-1~noble"],
    ]),
    marker: "",
};

const CURRENT: Server = {
    installed: new Map([
        ["nginx", "1.30.4-1~resolute"],
        ["nginx-module-njs", "1.30.4+1.0.1-1~resolute"],
        ["libnginx-mod-brotli", "1.1.0+nginx-1.30.4-1~resolute"],
    ]),
    marker: MARKERS,
};

const FAILED: CommandResult = { code: 1, stderr: "", stdout: "" };
const STATUS_PREFIX = "dpkg -s ";

const serverShell = function serverShell(server: Server): ReturnType<typeof fakeShell> {
    const state = { installed: false };
    const answers: readonly (readonly [(command: string) => boolean, (command: string) => CommandResult])[] = [
        [
            (command) => command.startsWith(STATUS_PREFIX),
            (command) => {
                const version = server.installed.get(command.slice(STATUS_PREFIX.length));
                return version === undefined ? FAILED : status(version);
            },
        ],
        [(command) => command.includes("VERSION_CODENAME"), () => ok(PLATFORM.codename)],
        [(command) => command.startsWith("dpkg --print-architecture"), () => ok(PLATFORM.architecture)],
        [(command) => command.startsWith("test -f"), () => (server.marker.length > 0 ? ok(server.marker) : FAILED)],
        [
            (command) => command === "nginx -t" && server.testFails === true && state.installed,
            () => {
                state.installed = false;
                return { code: 1, stderr: "module version mismatch", stdout: "" };
            },
        ],
    ];
    return fakeShell((command) => {
        state.installed ||= command.includes("--no-remove install");
        const answer = answers.find(([matches]) => matches(command));
        return answer === undefined ? ok() : answer[1](command);
    });
};

describe("planPackages", () => {
    it("swaps nginx and every module to this release's build and keeps the old builds to restore", async () => {
        const plan = await planPackages(serverShell(MIGRATING), fetchIndex, PLATFORM);
        expect(plan.install.map((entry) => entry.version)).toStrictEqual([
            "1.30.4-1~resolute",
            "1.30.4+1.0.1-1~resolute",
            "1.1.0+nginx-1.30.4-1~resolute",
        ]);
        expect(plan.revert.map((entry) => entry.version)).toStrictEqual([
            "1.30.4-1~noble",
            "1.1.0+nginx-1.30.4-1~noble",
        ]);
        expect(plan.added).toStrictEqual(["nginx-module-njs"]);
    });

    it("refuses before touching anything when a build to restore is no longer published", async () => {
        const server: Server = { installed: new Map([["nginx", "1.30.4-1~jammy"]]), marker: "" };
        await expect(planPackages(serverShell(server), fetchIndex, PLATFORM)).rejects.toThrow(
            PACKAGE_REVERT_UNAVAILABLE,
        );
    });

    it("refuses when no repository publishes the pinned nginx for this release", async () => {
        const plan = planPackages(serverShell(MIGRATING), fetchIndex, { architecture: "amd64", codename: "plucky" });
        await expect(plan).rejects.toThrow(PACKAGE_UNAVAILABLE);
    });
});

describe("ensureServer", () => {
    it("migrates a server in one guarded transaction that never removes a package", async () => {
        const shell = serverShell(MIGRATING);
        const journal = fakeJournal();
        await ensureServer(shell, journal, fetchIndex);
        const install = shell.commands.find((command) => command.includes("--no-remove install /")) ?? "";
        expect(install).toContain("nginx_1.30.4-1~resolute_amd64.deb");
        expect(install).toContain("nginx-module-njs_1.30.4+1.0.1-1~resolute_amd64.deb");
        expect(install).toContain("libnginx-mod-brotli_1.1.0+nginx-1.30.4-1~resolute_amd64.deb");
        expect(install).toContain("--force-confold");
        expect(shell.commands.some((command) => command.includes("make modules"))).toBe(true);
        expect(shell.commands.some((command) => command.includes("sha-nginx-1.30.4-1~noble"))).toBe(true);
        expect(shell.commands.some((command) => command.includes("--allow-downgrades"))).toBe(false);
        expect(shell.commands.at(-1)).toContain("rm -rf");
        expect(journal.lines).toContain(SERVER_READY);
    });

    it("changes nothing on a second run and leaves the test to the push, so a broken managed file cannot block its own repair", async () => {
        const shell = serverShell(CURRENT);
        const journal = fakeJournal();
        await ensureServer(shell, journal, fetchIndex);
        expect(shell.commands.some((command) => command.includes("apt-get"))).toBe(false);
        expect(shell.commands.some((command) => command.includes("make modules"))).toBe(false);
        expect(shell.commands).not.toContain("nginx -t");
        expect(journal.lines).toContain(SERVER_CURRENT);
    });

    it("restores the previous packages and modules when the configuration test fails, then fails", async () => {
        const shell = serverShell({ ...MIGRATING, testFails: true });
        const journal = fakeJournal();
        await expect(ensureServer(shell, journal, fetchIndex)).rejects.toThrow("module version mismatch");
        const revert = shell.commands.find((command) => command.includes("--allow-downgrades")) ?? "";
        expect(revert).toContain("nginx_1.30.4-1~noble_amd64.deb");
        expect(revert).toContain("remove nginx-module-njs");
        expect(journal.lines).toContain(PACKAGES_REVERTED);
    });
});

describe("prepareServer", () => {
    it("links the site only after its configuration is pushed, so a fresh server never holds a dangling link", async () => {
        const shell = serverShell(CURRENT);
        await prepareServer(shell, fakeJournal(), fetchIndex);
        const pushed = shell.commands.findIndex((command) => command.includes("sudo mv"));
        const linked = shell.commands.findIndex((command) => command.includes(SITE_LINK));
        expect(pushed).toBeGreaterThan(-1);
        expect(linked).toBeGreaterThan(pushed);
    });
});
