import type { Resolution, SlotUse } from "../types/binding.types.ts";
import { RESOLUTION_STATES } from "../constants/binding.constants.ts";

const SLOT_OPEN = "{";
const SLOT_CLOSE = "}";
const SLOT_CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.";

const isSlotName = function isSlotName(name: string): boolean {
    if (name.length === 0) {
        return false;
    }
    for (const character of name) {
        if (!SLOT_CHARACTERS.includes(character)) {
            return false;
        }
    }
    return true;
};

const slotNamesOf = function slotNamesOf(line: string): string[] {
    return line
        .split(SLOT_OPEN)
        .slice(1)
        .flatMap((segment) => {
            const close = segment.indexOf(SLOT_CLOSE);
            const name = close === -1 ? "" : segment.slice(0, close);
            return isSlotName(name) ? [SLOT_OPEN + name + SLOT_CLOSE] : [];
        });
};

const earliestState = function earliestState(line: string): Resolution | undefined {
    const found = RESOLUTION_STATES.map((state) => ({ at: line.indexOf(state), state })).filter(({ at }) => at !== -1);
    return found.toSorted((left, right) => left.at - right.at)[0]?.state;
};

export const slotsIn = function slotsIn(source: string): SlotUse[] {
    return source.split("\n").flatMap((line, index) => slotNamesOf(line).map((name) => ({ line: index + 1, name })));
};

export const slotStates = function slotStates(source: string): Map<string, Resolution> {
    const out = new Map<string, Resolution>();
    for (const line of source.split("\n")) {
        const state = earliestState(line);
        if (state === undefined) {
            continue;
        }
        for (const use of slotsIn(line)) {
            if (!out.has(use.name)) {
                out.set(use.name, state);
            }
        }
    }
    return out;
};

const WILDCARD_SLOT = ".*}";

export const enumeratesVocabulary = function enumeratesVocabulary(line: string): boolean {
    return line.includes(WILDCARD_SLOT);
};
