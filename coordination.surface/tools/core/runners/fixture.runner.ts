import { existsSync, readFileSync, writeFileSync } from "node:fs";

import {
    fixtureAdded,
    fixtureContended,
    fixtureModuleMissing,
    halfMissing,
    notAPair,
    setMissing,
} from "../strings/fixture.strings.ts";

const CLOSER = "];";

const FIRES_LEAD = "FIRES ";

const ACCEPTS_LEAD = "ACCEPTS ";

const PAIR_SEPARATOR = "/";

const SAMPLE_LEADS: readonly (readonly ["accepts" | "fires", string])[] = [
    ["fires", FIRES_LEAD],
    ["accepts", ACCEPTS_LEAD],
];

const ESCAPES: ReadonlyMap<string, string> = new Map([
    ["\\", String.raw`\\`],
    ['"', String.raw`\"`],
    ["\n", String.raw`\n`],
]);

interface FixtureSample {
    readonly path: string;
    readonly text: string;
}

interface ParsedSamples {
    readonly fires: FixtureSample | null;
    readonly accepts: FixtureSample | null;
}

interface FixtureRequest {
    readonly target: string;
    readonly absolute: string;
    readonly pair: string;
    readonly body: string;
    readonly witness: string;
}

interface FixtureOutcome {
    readonly code: number;
    readonly message: string;
}

export const parseSamples = function parseSamples(body: string): ParsedSamples {
    let fires: FixtureSample | null = null;
    let accepts: FixtureSample | null = null;

    let openPath = "";
    let openLines: string[] = [];
    let into: "" | "accepts" | "fires" = "";

    const close = (): void => {
        if (into === "" || openPath.length === 0) {
            return;
        }
        const sample = { path: openPath, text: `${openLines.join("\n")}\n` };
        if (into === "fires") {
            fires = sample;
        } else {
            accepts = sample;
        }
    };

    for (const line of body.split("\n")) {
        const lead = SAMPLE_LEADS.find(([, prefix]) => line.startsWith(prefix));
        if (lead === undefined) {
            if (into !== "") {
                openLines.push(line);
            }
        } else {
            close();
            [into] = lead;
            openPath = line.slice(lead[1].length).trim();
            openLines = [];
        }
    }

    close();
    return { accepts, fires };
};

const quoted = function quoted(text: string): string {
    let escaped = "";
    for (const character of text) {
        escaped += ESCAPES.get(character) ?? character;
    }
    return `"${escaped}"`;
};

export const fixtureEntry = function fixtureEntry(rule: string, kind: string, samples: ParsedSamples): string {
    const { fires } = samples;
    const { accepts } = samples;

    return [
        "    {",
        `        rule: ${quoted(rule)},`,
        `        kind: ${quoted(kind)},`,
        "        fires: [",
        `            { path: ${quoted(fires?.path ?? "")}, text: ${quoted(fires?.text ?? "")} },`,
        "        ],",
        "        passes: [",
        `            { path: ${quoted(accepts?.path ?? "")}, text: ${quoted(accepts?.text ?? "")} },`,
        "        ],",
        "    },",
    ].join("\n");
};

const pairRefusal = function pairRefusal(request: FixtureRequest, samples: ParsedSamples): string | null {
    if (!existsSync(request.absolute)) {
        return fixtureModuleMissing(request.target);
    }

    const separator = request.pair.indexOf(PAIR_SEPARATOR);
    if (separator <= 0 || separator === request.pair.length - 1) {
        return notAPair(request.pair);
    }

    if (samples.fires === null || samples.accepts === null) {
        return halfMissing(samples.fires === null ? "fired" : "accepted");
    }

    return null;
};

export const runFixture = function runFixture(request: FixtureRequest): FixtureOutcome {
    const samples = parseSamples(request.body);
    const refusal = pairRefusal(request, samples);
    if (refusal !== null) {
        return { code: 2, message: refusal };
    }

    const before = readFileSync(request.absolute, "utf8");
    if (before !== request.witness) {
        return { code: 2, message: fixtureContended(request.target) };
    }

    const lines = before.split("\n");
    const at = lines.findLastIndex((line) => line.trim() === CLOSER);
    if (at === -1) {
        return { code: 2, message: setMissing(request.target) };
    }

    const separator = request.pair.indexOf(PAIR_SEPARATOR);
    const [rule, kind] = [request.pair.slice(0, separator), request.pair.slice(separator + 1)];
    const written = [...lines.slice(0, at), fixtureEntry(rule, kind, samples), ...lines.slice(at)].join("\n");
    writeFileSync(request.absolute, written, "utf8");

    return { code: 0, message: fixtureAdded(request.pair, request.target) };
};
