import { NO_FENCE, splitLines, stepFence } from "#core/parsers/markdown.parser";
import type { Fence } from "#types/markdown.types";
import type { MermaidBlock } from "#types/diagram.types";

const FENCE_BODY_OFFSET = 2;
const MERMAID_LANG = "mermaid";
const INLINE_SPACE: ReadonlySet<string> = new Set([" ", "\t"]);

const fenceInfoLang = function fenceInfoLang(trimmed: string, len: number): string {
    let at = len;
    while (at < trimmed.length && INLINE_SPACE.has(trimmed.charAt(at))) {
        at += 1;
    }
    const start = at;
    while (at < trimmed.length && !INLINE_SPACE.has(trimmed.charAt(at))) {
        at += 1;
    }
    return trimmed.slice(start, at).toLowerCase();
};

class MermaidBlockReader {
    public readonly blocks: MermaidBlock[] = [];
    private fence: Fence = NO_FENCE;
    private inMermaid = false;
    private buffer: string[] = [];
    private startLine = 0;

    public feed(line: string, index: number): void {
        const trimmed = line.trim();
        const wasOpen = this.fence.open;
        this.fence = stepFence(trimmed, this.fence);
        if (!wasOpen && this.fence.open) {
            this.openFence(trimmed, index);
            return;
        }
        if (wasOpen && !this.fence.open) {
            this.closeFence();
            return;
        }
        if (wasOpen && this.inMermaid) {
            this.buffer.push(line);
        }
    }

    private openFence(trimmed: string, index: number): void {
        this.inMermaid = fenceInfoLang(trimmed, this.fence.len) === MERMAID_LANG;
        this.buffer = [];
        this.startLine = index + FENCE_BODY_OFFSET;
    }

    private closeFence(): void {
        if (this.inMermaid) {
            this.blocks.push({ code: this.buffer.join("\n"), startLine: this.startLine });
        }
        this.inMermaid = false;
    }
}

export const mermaidBlocks = function mermaidBlocks(source: string): MermaidBlock[] {
    const reader = new MermaidBlockReader();
    splitLines(source).forEach((line, index) => {
        reader.feed(line, index);
    });
    return reader.blocks;
};
