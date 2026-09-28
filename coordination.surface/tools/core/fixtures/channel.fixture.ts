import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { GENERATED_DIR } from "../constants/path.constants.ts";
import { channelReportName } from "../reporters/rule.reporter.ts";
import { channelsIn, collidingScopes, misnamedChannels, removeChannel, staleChannels } from "../validators/channel.validator.ts";
import type { BranchFixture, BranchObservation } from "../types/fixture.types.ts";

const LIVE_SCOPE = "rule=surface";

const GONE_SCOPE = "rule=a-check-nothing-registers";

function channelAt(scope: string): string {
    return `${GENERATED_DIR}/${channelReportName(scope)}`;
}

const CHANNEL_BODY = JSON.stringify({ tool: "govern", authoritative: false, verdict: "pass" });

const AGGREGATE_BODY = JSON.stringify({ tool: "govern", authoritative: true, verdict: "pass" });

function resolves(scope: string): boolean {
    return scope === LIVE_SCOPE;
}

function sweeping(root: string): BranchObservation {
    const before = channelsIn(root).length;
    const stale = staleChannels(root, resolves);
    for (const channel of stale) removeChannel(root, channel.name);

    return {
        found: before,
        removed: stale.length,
        kept: existsSync(resolve(root, channelAt(LIVE_SCOPE))),
        declared: stale.every((channel) => channel.removable && channel.scope.length > 0),
    };
}

const SECOND_SCOPE = "rule=board";

function bodyFor(scope: string): string {
    return JSON.stringify({ tool: "govern", authoritative: false, verdict: "pass", scope });
}

function naming(root: string): BranchObservation {
    return {
        misnamed: misnamedChannels(root).length,
        colliding: collidingScopes(root).length,
        population: channelsIn(root).length,
    };
}

export const CHANNEL_BRANCH_FIXTURES: readonly BranchFixture[] = [
    {
        subject: "channel.validator",
        branch: "every channel names the scope its body declares, which is the accepted half of the round trip",
        seed: [
            { path: channelAt(LIVE_SCOPE), text: bodyFor(LIVE_SCOPE) },
            { path: channelAt(SECOND_SCOPE), text: bodyFor(SECOND_SCOPE) },
        ],
        exercise: (root) => naming(root),
        expect: { misnamed: 0, colliding: 0, population: 2 },
    },
    {
        subject: "channel.validator",
        branch: "a channel whose name decodes to one scope while its body declares another",
        seed: [{ path: channelAt(LIVE_SCOPE), text: bodyFor(SECOND_SCOPE) }],
        exercise: (root) => naming(root),
        expect: { misnamed: 1, colliding: 0, population: 1 },
    },
    {
        subject: "channel.validator",
        branch: "two channels declaring one scope, which is a derivation that changed rather than one that collides",
        seed: [
            { path: channelAt(LIVE_SCOPE), text: bodyFor(SECOND_SCOPE) },
            { path: channelAt(SECOND_SCOPE), text: bodyFor(SECOND_SCOPE) },
        ],
        exercise: (root) => naming(root),
        expect: { misnamed: 1, colliding: 1, population: 2 },
    },
    {
        subject: "channel.validator",
        branch: "a channel whose scope no longer resolves, removed beside one whose scope does",
        seed: [
            { path: channelAt(LIVE_SCOPE), text: CHANNEL_BODY },
            { path: channelAt(GONE_SCOPE), text: CHANNEL_BODY },
        ],
        exercise: (root) => sweeping(root),
        expect: { found: 2, removed: 1, kept: true, declared: true },
    },
    {
        subject: "channel.validator",
        branch: "a whole-scope aggregate, which no channel walk identifies however its scope reads",
        seed: [
            { path: channelAt(GONE_SCOPE), text: AGGREGATE_BODY },
            { path: channelAt(LIVE_SCOPE), text: CHANNEL_BODY },
        ],
        exercise: (root) => sweeping(root),
        expect: { found: 1, removed: 0, kept: true, declared: true },
    },
];
