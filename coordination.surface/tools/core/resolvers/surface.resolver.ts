import { ASSESSED_FORMS, TOOL_WRITTEN } from "../registries/surface.registry.ts";
import type {
    MandateRoute,
    MandatedSurface,
    ResolvedMandate,
    ToolForm,
    WritablePair,
    WriteOperand,
} from "../types/surface.types.ts";
import { PARTY_WRITTEN, RECORD_FIELD_REFUSAL, SEEDED_MANDATES } from "../constants/surface.constants.ts";
import { config, isResolved, surfacePath, surfacePrefix } from "../../../config/surface.config.ts";
import { BLOCKING_SUFFIX } from "../constants/blocking.constants.ts";
import { BOARD_PATH } from "../constants/board.constants.ts";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { venueFieldsFrom } from "../validators/venue.validator.ts";

const FLAG_OPEN = '"--';

const FLAG_CLOSE = '"';

export const venueMandates = function venueMandates(template: string): Omit<MandatedSurface, "slot">[] {
    const out: Omit<MandatedSurface, "slot">[] = [...SEEDED_MANDATES];
    for (const field of venueFieldsFrom(template)) {
        out.push({ member: field, operand: "field", refusal: RECORD_FIELD_REFUSAL });
    }
    return out;
};

const immutableRoot = function immutableRoot(): string | null {
    return isResolved("surface", "venue_archive") ? surfacePath("venue_archive") : null;
};

const suffixTargets = function suffixTargets(paths: readonly string[]): string[] {
    const immutable = immutableRoot();
    return paths
        .filter((path) => path.endsWith(BLOCKING_SUFFIX))
        .filter((path) => immutable === null || !path.startsWith(`${immutable}/`));
};

const pairsFor = function pairsFor(written: ToolForm, venues: string): WritablePair[] {
    const anyMember = written.anyMember === true;
    const at = (path: string): WritablePair => ({ anyMember, member: written.member, operand: written.operand, path });

    if (written.slots !== undefined) {
        return written.slots
            .filter((slotName) => isResolved("surface", slotName))
            .map((slotName) => at(surfacePath(slotName)));
    }
    return written.venueOnly ? [at(venues)] : [at(BOARD_PATH), at(venues)];
};

export const surfaceTarget = function surfaceTarget(root: string, named: string): string {
    if (existsSync(resolve(root, named))) {
        return named;
    }
    const prefix = surfacePrefix();
    const prefixed = prefix.length === 0 ? named : `${prefix}/${named}`;
    return existsSync(resolve(root, prefixed)) ? prefixed : named;
};

export const toolWritable = function toolWritable(): WritablePair[] {
    const prefix = surfacePrefix();
    const venues = prefix.length === 0 ? BLOCKING_SUFFIX : `${prefix}/${BLOCKING_SUFFIX}`;
    return TOOL_WRITTEN.flatMap((written) => pairsFor(written, venues));
};

const isFlagCharacter = function isFlagCharacter(char: string): boolean {
    if (char === "-") {
        return true;
    }
    return char >= "a" && char <= "z";
};

export const flagsIn = function flagsIn(source: string): string[] {
    const out: string[] = [];
    let from = 0;

    while (from < source.length) {
        const open = source.indexOf(FLAG_OPEN, from);
        if (open === -1) {
            break;
        }

        let cursor = open + 1;
        while (cursor < source.length && isFlagCharacter(source.charAt(cursor))) {
            cursor += 1;
        }

        const flag = source.slice(open + 1, cursor);
        const named = cursor > open + FLAG_OPEN.length;
        if (named && source.charAt(cursor) === FLAG_CLOSE && !out.includes(flag)) {
            out.push(flag);
        }
        from = open + FLAG_OPEN.length;
    }

    return out;
};

const inScope = function inScope(paths: readonly string[], target: string): boolean {
    return paths.some((path) => path === target || path.startsWith(`${target}/`));
};

const reachedByTool = function reachedByTool(
    target: string,
    operand: WriteOperand,
    member: string | null,
    writable: readonly WritablePair[],
): boolean {
    const bothVenues = (pair: WritablePair): boolean =>
        pair.path.endsWith(BLOCKING_SUFFIX) && target.endsWith(BLOCKING_SUFFIX);
    return writable
        .filter((pair) => pair.operand === operand && (pair.anyMember || pair.member === member))
        .some((pair) => target === pair.path || bothVenues(pair));
};

export const isDeclaredSlot = function isDeclaredSlot(slot: string): boolean {
    return Object.keys(config.surface).includes(slot) && isResolved("surface", slot);
};

export const slotMandates = function slotMandates(): ResolvedMandate[] {
    return PARTY_WRITTEN.filter((mandated) => isDeclaredSlot(mandated.slot)).map((mandated) => ({
        from: mandated.slot,
        member: mandated.member,
        operand: mandated.operand,
        refusal: mandated.refusal,
        target: surfacePath(mandated.slot),
        ...(mandated.lowCost === undefined ? {} : { lowCost: mandated.lowCost }),
    }));
};

export const suffixMandates = function suffixMandates(
    paths: readonly string[],
    members: readonly Omit<MandatedSurface, "slot">[],
): ResolvedMandate[] {
    return suffixTargets(paths).flatMap((target) =>
        members.map((mandated) => ({
            from: target,
            member: mandated.member,
            operand: mandated.operand,
            refusal: mandated.refusal,
            target,
        })),
    );
};

export const regionsWith = function regionsWith(effect: string): Set<string> {
    return new Set(
        Object.values(ASSESSED_FORMS).flatMap((assessment) =>
            assessment.region !== null && assessment.effect === effect ? [assessment.region] : [],
        ),
    );
};

export const mandateRoute = function mandateRoute(
    mandated: ResolvedMandate,
    paths: readonly string[],
    writable: readonly WritablePair[],
): MandateRoute {
    if (!inScope(paths, mandated.target)) {
        return "outOfScope";
    }
    return reachedByTool(mandated.target, mandated.operand, mandated.member, writable) ? "reached" : "unwritable";
};

export const namedOf = function namedOf(mandated: ResolvedMandate): string {
    return mandated.member === null ? mandated.operand : `${mandated.operand} ${mandated.member}`;
};
