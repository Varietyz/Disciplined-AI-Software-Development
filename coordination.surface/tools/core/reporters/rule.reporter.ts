import { JOIN_ABANDONED, joinedResult } from "../strings/pipeline.strings.ts";

import type { PipelineReport, RuleReport } from "../types/rule.types.ts";
import { decodeScope, encodeScope } from "../transformers/scope.transformer.ts";
import { dirname, join } from "node:path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { GENERATED_DIR } from "../constants/path.constants.ts";
import { isObject } from "../predicates/schema.predicate.ts";
import { isUnreadableJson } from "../predicates/file.predicate.ts";

const write = function write(repoRoot: string, name: string, body: unknown): string {
    const target = join(repoRoot, GENERATED_DIR, name);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, `${JSON.stringify(body, null, 4)}\n`, "utf8");
    return target;
};

export const ruleReportName = function ruleReportName(ruleId: string): string {
    return `${ruleId}.report.generated.json`;
};

export const writeRuleReport = function writeRuleReport(repoRoot: string, ruleId: string, report: RuleReport): string {
    return write(repoRoot, ruleReportName(ruleId), report);
};

export const AGGREGATE_REPORT = "pipeline.report.generated.json";

const CHANNEL_LEAD = "pipeline.";

const CHANNEL_TAIL = ".report.generated.json";

export const channelReportName = function channelReportName(scope: string): string {
    return `${CHANNEL_LEAD}${encodeScope(scope)}${CHANNEL_TAIL}`;
};

export const channelScopeOf = function channelScopeOf(name: string): string | null {
    if (!name.startsWith(CHANNEL_LEAD) || !name.endsWith(CHANNEL_TAIL)) {
        return null;
    }

    const encoded = name.slice(CHANNEL_LEAD.length, name.length - CHANNEL_TAIL.length);
    if (encoded.length === 0) {
        return null;
    }

    return decodeScope(encoded);
};

const parsedAggregate = function parsedAggregate(repoRoot: string): Record<string, unknown> | null {
    const target = join(repoRoot, GENERATED_DIR, AGGREGATE_REPORT);
    if (!existsSync(target)) {
        return null;
    }

    try {
        const parsed: unknown = JSON.parse(readFileSync(target, "utf8"));
        return isObject(parsed) ? parsed : null;
    } catch (error) {
        if (isUnreadableJson(error)) {
            return null;
        }
        throw error;
    }
};

export const supersedingRun = function supersedingRun(repoRoot: string, at: number): number {
    const stamp = parsedAggregate(repoRoot)?.["at"];
    return typeof stamp === "number" && stamp > at ? stamp : 0;
};

const JOIN_POLL_MS = 500;

const JOIN_LIMIT_MS = 600_000;

const publishedAfter = function publishedAfter(repoRoot: string, at: number): Record<string, unknown> | null {
    const record = parsedAggregate(repoRoot);
    const stamp = record?.["at"];
    return typeof stamp === "number" && stamp >= at ? record : null;
};

const textOr = function textOr(value: unknown, absent: string): string {
    return typeof value === "string" ? value : absent;
};

const joinedOutcome = function joinedOutcome(published: Record<string, unknown>): { message: string; code: number } {
    const verdict = textOr(published["verdict"], "unknown");
    const agent = textOr(published["agent"], "an undeclared caller");
    const scope = textOr(published["scope"], "unknown");
    const listed = published["findings"];
    const findings = Array.isArray(listed) ? listed.length : 0;

    return {
        code: verdict === "pass" ? 0 : 1,
        message: joinedResult({ agent, findings, scope, verdict }, AGGREGATE_REPORT),
    };
};

const pause = async function pause(ms: number): Promise<void> {
    await new Promise<void>((done) => {
        setTimeout(done, ms);
    });
};

const awaitPublished = async function awaitPublished(
    repoRoot: string,
    at: number,
    deadline: number,
): Promise<{ message: string; code: number }> {
    const published = publishedAfter(repoRoot, at);
    if (published !== null) {
        return joinedOutcome(published);
    }

    if (Date.now() > deadline) {
        return { code: 2, message: JOIN_ABANDONED };
    }

    await pause(JOIN_POLL_MS);
    return awaitPublished(repoRoot, at, deadline);
};

export const joinLiveRun = async function joinLiveRun(
    repoRoot: string,
    at: number,
): Promise<{ message: string; code: number }> {
    return awaitPublished(repoRoot, at, at + JOIN_LIMIT_MS);
};

export const writePipelineReport = function writePipelineReport(
    repoRoot: string,
    report: PipelineReport,
): string | null {
    if (!report.authoritative) {
        return null;
    }
    if (supersedingRun(repoRoot, report.at) !== 0) {
        return null;
    }

    return write(repoRoot, AGGREGATE_REPORT, report);
};
