import type { FigureFrame, Region, ScenarioStep, ScenarioTool, ToolStep, WaitStep } from "#types/surface.types";
import { SAMPLE_INVARIANT, stepFailed, venueMissing, waitUnresolved } from "#configuration/strings/surface.strings";
import {
    SCENARIO,
    STEP_TIMEOUT_MS,
    VENUE_PLACEHOLDER,
    WAIT_LIMIT_MS,
    WAIT_POLL_MS,
    WAIT_SETTLE_MS,
} from "#configuration/constants/surface.constants";
import { appendFileSync, readFileSync, readdirSync } from "node:fs";
import { appendLine, changedRegion, commandLine, markedLines, venueView } from "#core/converters/surface.converter";
import { spawn, spawnSync } from "node:child_process";
import type { SurfaceFigureName } from "@banes-lab/web/types/surface.types.ts";
import { join } from "node:path";

const UTF8 = "utf8";

const LINE_BREAK = "\n";

interface Shown {
    readonly command: string;
    readonly output: string;
    readonly before: readonly string[];
    readonly highlight: Region | null;
}

const pause = async function pause(ms: number): Promise<void> {
    await new Promise<void>((done) => {
        setTimeout(done, ms);
    });
};

const settled = async function settled(
    read: () => string,
    since: string,
    quietFor: number,
    left: number,
): Promise<string> {
    await pause(WAIT_POLL_MS);
    const now = read();
    const quiet = now.length > 0 && now === since ? quietFor + WAIT_POLL_MS : 0;
    return quiet >= WAIT_SETTLE_MS || left <= 0 ? now : settled(read, now, quiet, left - WAIT_POLL_MS);
};

const exitWithin = async function exitWithin(closed: Promise<number>, limit: number): Promise<number | null> {
    const expired = pause(limit).then((): number | null => null);
    return Promise.race<number | null>([closed, expired]);
};

export class ScenarioPlayer {
    private readonly install: string;
    private readonly scripts: ReadonlyMap<ScenarioTool, string>;
    private readonly frames: FigureFrame[] = [];
    private venue: string | null = null;
    private lastRegion: Region | null = null;

    public constructor(install: string, scripts: ReadonlyMap<ScenarioTool, string>) {
        this.install = install;
        this.scripts = scripts;
    }

    public async play(): Promise<readonly FigureFrame[]> {
        await this.playFrom(0);
        return this.frames;
    }

    private async playFrom(index: number): Promise<void> {
        const step = SCENARIO.steps.at(index);
        if (step === undefined) {
            return;
        }
        const taken = await this.take(step, SCENARIO.steps.at(index + 1));
        await this.playFrom(index + taken);
    }

    private async take(step: ScenarioStep, next: ScenarioStep | undefined): Promise<number> {
        if (step.kind === "wait") {
            await this.runWait(step, next);
            return 2;
        }
        if (step.kind === "write") {
            this.runWrite(step.text, step.figures);
        } else {
            this.runTool(step);
        }
        return 1;
    }

    private resolved(args: readonly string[]): string[] {
        return args.map((argument) => (argument === VENUE_PLACEHOLDER ? (this.venue ?? argument) : argument));
    }

    private venueLines(): string[] {
        return this.venue === null
            ? []
            : venueView(readFileSync(join(this.install, this.venue), UTF8).split(LINE_BREAK));
    }

    private discoverVenue(): void {
        this.venue ??= readdirSync(this.install).find((name) => name.startsWith(`${SAMPLE_INVARIANT}.`)) ?? null;
    }

    private show(figures: readonly SurfaceFigureName[], shown: Shown): void {
        const lines = markedLines(this.venueLines(), shown.highlight);
        const frame = { command: shown.command, lines, output: shown.output, surface: this.venue ?? "" };
        this.frames.push(...figures.map((figure) => ({ before: shown.before, figure, frame })));
    }

    private runTool(step: ToolStep): void {
        const args = this.resolved(step.args);
        const command = commandLine(step.tool, args);
        const before = this.venueLines();
        const result = spawnSync(process.execPath, [this.scripts.get(step.tool) ?? "", ...args], {
            cwd: this.install,
            encoding: UTF8,
            timeout: STEP_TIMEOUT_MS,
        });
        const output = `${result.stdout}${result.stderr}`;
        const code = result.status ?? -1;
        if (step.exit !== null && code !== step.exit) {
            throw new Error(stepFailed(command, step.exit, code, output));
        }
        this.discoverVenue();
        const own = changedRegion(before, this.venueLines());
        const delivered = step.delivers ? this.lastRegion : null;
        this.lastRegion = own ?? this.lastRegion;
        this.show(step.figures, { before, command, highlight: own ?? delivered, output });
    }

    private async runWait(step: WaitStep, writer: ScenarioStep | undefined): Promise<void> {
        const args = this.resolved(step.args);
        const command = commandLine("await", args);
        const child = spawn(process.execPath, [this.scripts.get("await") ?? "", ...args], { cwd: this.install });
        let output = "";
        const collect = (chunk: string): void => {
            output += chunk;
        };
        child.stdout.setEncoding(UTF8).on("data", collect);
        child.stderr.setEncoding(UTF8).on("data", collect);
        const closed = new Promise<number>((done) => {
            child.on("close", (code) => {
                done(code ?? -1);
            });
        });

        const parked = await settled(() => output, "", 0, WAIT_LIMIT_MS);
        this.show(step.figures, { before: this.venueLines(), command, highlight: null, output: parked });
        if (writer?.kind === "tool") {
            this.runTool(writer);
        }

        const code = await exitWithin(closed, WAIT_LIMIT_MS);
        if (code === null) {
            child.kill();
            throw new Error(waitUnresolved(command));
        }
        if (code !== step.exit) {
            throw new Error(stepFailed(command, step.exit, code, output));
        }
        this.show(step.figures, { before: this.venueLines(), command, highlight: this.lastRegion, output });
    }

    private runWrite(text: string, figures: readonly SurfaceFigureName[]): void {
        if (this.venue === null) {
            throw new Error(venueMissing());
        }
        const before = this.venueLines();
        appendFileSync(join(this.install, this.venue), LINE_BREAK + text + LINE_BREAK, UTF8);
        const own = changedRegion(before, this.venueLines());
        this.lastRegion = own ?? this.lastRegion;
        this.show(figures, { before, command: appendLine(text, this.venue), highlight: own, output: "" });
    }
}
