import type { CommandInvocation } from "#types/tool.types";

const QUOTES = new Set(['"', "'"]);
const SPACE = " ";

interface TokenState {
    current: string;
    open: boolean;
    quote: string;
    tokens: string[];
}

const stepChar = function stepChar(state: TokenState, ch: string): TokenState {
    if (state.quote !== "") {
        const closing = ch === state.quote;
        return {
            current: closing ? state.current : state.current + ch,
            open: true,
            quote: closing ? "" : state.quote,
            tokens: state.tokens,
        };
    }
    if (QUOTES.has(ch)) {
        return { current: state.current, open: true, quote: ch, tokens: state.tokens };
    }
    if (ch === SPACE) {
        return {
            current: "",
            open: false,
            quote: "",
            tokens: state.open ? [...state.tokens, state.current] : state.tokens,
        };
    }
    return { current: state.current + ch, open: true, quote: "", tokens: state.tokens };
};

export const tokenizeCommand = function tokenizeCommand(command: string): string[] {
    let state: TokenState = { current: "", open: false, quote: "", tokens: [] };
    for (const ch of command) {
        state = stepChar(state, ch);
    }
    return state.open ? [...state.tokens, state.current] : state.tokens;
};

export const commandOf = function commandOf(command: string, fallback: string): CommandInvocation {
    const [bin = fallback, ...prefix] = tokenizeCommand(command);
    return { bin, prefix };
};
