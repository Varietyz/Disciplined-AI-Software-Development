import type { CaptureOptions, StartedServer } from "#types/route.types";
import { LISTEN_POLL_MS, LISTEN_TIMEOUT_MS } from "#configuration/configs/route.config";
import { awaitRelease, holdersOf, terminateTree } from "@banes-lab/build-scripts/core/adapters/server.adapter.ts";
import { listeningAfter, neverListened, portHeld, portStillHeld } from "#configuration/strings/route.strings";
import { absolutePath } from "@ssot/paths";
import { capturePage } from "#core/coordinators/snapshot.coordinator";
import { join } from "node:path";
import { mkdirSync } from "node:fs";
import { portOf } from "@ssot/secrets";
import process from "node:process";
import { snapshotFor } from "#core/converters/route.converter";
import spawn from "cross-spawn";
import { wait } from "@banes-lab/build-scripts/core/timers/base.timer.ts";
import { writeVerbatim } from "@govlab/canonical-write";

const WINDOWS = "win32";
const VITE_CONFIG = "vite.config.ts";
const SERVER_LOG = "dev-server.log";

const startServer = function startServer(): StartedServer {
    const output: string[] = [];
    const server = spawn("npx", ["vite", "--config", absolutePath("app.member", VITE_CONFIG), "--host"], {
        detached: process.platform !== WINDOWS,
        stdio: ["ignore", "pipe", "pipe"],
    });
    const collect = (chunk: unknown): void => {
        output.push(String(chunk));
    };
    server.stdout?.on("data", collect);
    server.stderr?.on("data", collect);
    return { output, process: server };
};

const awaitListening = async function awaitListening(port: number, startedAt: number): Promise<number | null> {
    const elapsed = performance.now() - startedAt;
    if (holdersOf(port).length > 0) {
        return Math.round(elapsed);
    }
    if (elapsed >= LISTEN_TIMEOUT_MS) {
        return null;
    }
    await wait(LISTEN_POLL_MS);
    return awaitListening(port, startedAt);
};

const captureEach = async function captureEach(binary: string, options: CaptureOptions): Promise<boolean> {
    return options.routes.reduce<Promise<boolean>>(async (prior, route) => {
        const earlier = await prior;
        const written = await capturePage(binary, snapshotFor(options, route));
        return earlier && written;
    }, Promise.resolve(true));
};

const captureWhenListening = async function captureWhenListening(
    binary: string,
    options: CaptureOptions,
    started: { readonly at: number; readonly port: number },
): Promise<boolean> {
    const { at, port } = started;
    const listening = await awaitListening(port, at);
    if (listening === null) {
        process.stderr.write(neverListened(port));
        return false;
    }
    process.stdout.write(listeningAfter(listening));
    return captureEach(binary, options);
};

const stopServer = async function stopServer(server: StartedServer, outDir: string, port: number): Promise<boolean> {
    if (server.process.pid !== undefined) {
        terminateTree(server.process.pid);
    }
    const released = await awaitRelease(port);
    writeVerbatim(join(outDir, SERVER_LOG), server.output.join(""));
    if (!released) {
        process.stderr.write(portStillHeld(port));
    }
    return released;
};

export const captureRoutes = async function captureRoutes(binary: string, options: CaptureOptions): Promise<boolean> {
    const port = portOf("SITE_DEV_PORT");
    const held = holdersOf(port);
    if (held.length > 0) {
        process.stderr.write(portHeld(port, held));
        return false;
    }
    mkdirSync(options.outDir, { recursive: true });
    const at = performance.now();
    const server = startServer();
    const [outcome] = await Promise.allSettled([captureWhenListening(binary, options, { at, port })]);
    const released = await stopServer(server, options.outDir, port);
    if (outcome.status === "rejected") {
        throw outcome.reason instanceof Error ? outcome.reason : new Error(String(outcome.reason));
    }
    return outcome.value && released;
};
