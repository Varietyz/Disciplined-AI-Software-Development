import {
    BARE_INVARIANT_HEADS,
    BULLET,
    DECLARATION_PREFIX,
    HEADER_PREFIX,
    INVARIANT_PREFIX,
    META_MARKER,
    REPORT_HEAD,
} from "#configuration/constants/grammar.constants";
import type { PagDocument, PagGate, PagNode, ParsedHeader } from "#types/grammar.document.types";
import { fieldOf, parseDeclaration, readFrontmatter } from "#core/parsers/metadata.parser";
import { gateMarkerOf, stepGate } from "#core/parsers/check.parser";
import { nodeFieldOf, nodeOf, parseHeader } from "#core/parsers/node.parser";
import { parseInvariant } from "#core/parsers/invariant.parser";
import { splitLines } from "#core/converters/text.converter";

const WORD_SEPARATOR = " ";

type Mode = "bare" | "body" | "gate" | "invariants" | "repair" | "report";

class ParseState {
    public doc: PagDocument;
    private node: PagNode | null = null;
    private gate: PagGate | null = null;
    private invariant: { text: string; line: number } | null = null;
    private mode: Mode = "body";
    private inMeta = false;

    public constructor(frontmatter: string | null) {
        this.doc = { declaration: null, frontmatter, invariants: [], meta: {}, nodes: [], report: null, retired: [] };
    }

    public finish(): void {
        this.flushInvariant();
        this.flushNode();
    }

    public consume(trimmed: string, lineNo: number): void {
        if (trimmed === "") {
            this.inMeta = false;
            this.mode = this.mode === "gate" ? "body" : this.mode;
            return;
        }
        const handlers = [
            (): boolean => this.handleMeta(trimmed),
            (): boolean => this.handleDeclaration(trimmed, lineNo),
            (): boolean => this.handleHeader(trimmed, lineNo),
            (): boolean => this.handleBareHead(trimmed, lineNo),
            (): boolean => this.handleReportHead(trimmed, lineNo),
            (): boolean => this.handleMode(trimmed, lineNo),
            (): boolean => this.handleGateLine(trimmed, lineNo),
            (): boolean => this.handleNodeLine(trimmed),
        ];
        handlers.some((handler) => handler());
    }

    private flushNode(): void {
        if (this.node) {
            this.node.gate = this.gate;
            this.doc.nodes.push(this.node);
        }
        this.node = null;
        this.gate = null;
    }

    private flushInvariant(): void {
        if (this.invariant) {
            this.doc.invariants.push(parseInvariant(this.invariant.text, this.invariant.line));
        }
        this.invariant = null;
    }

    private handleMeta(trimmed: string): boolean {
        if (trimmed.startsWith(META_MARKER)) {
            this.inMeta = true;
            return true;
        }
        const field = this.inMeta ? fieldOf(trimmed) : null;
        if (field !== null) {
            this.doc.meta[field.key] = field.value;
            return true;
        }
        this.inMeta = false;
        return false;
    }

    private handleDeclaration(trimmed: string, lineNo: number): boolean {
        if (this.doc.declaration || !trimmed.startsWith(DECLARATION_PREFIX)) {
            return false;
        }
        this.doc.declaration = parseDeclaration(trimmed, lineNo);
        return true;
    }

    private handleHeader(trimmed: string, lineNo: number): boolean {
        if (!trimmed.startsWith(HEADER_PREFIX) || gateMarkerOf(trimmed) !== null) {
            return false;
        }
        const header = parseHeader(trimmed.slice(HEADER_PREFIX.length));
        if (header.kind !== "comment") {
            this.flushInvariant();
            this.flushNode();
            this.openHeader(header, trimmed, lineNo);
        }
        return true;
    }

    private openHeader(header: ParsedHeader, trimmed: string, lineNo: number): void {
        if (header.kind === "invariants" || header.kind === "repair") {
            this.mode = header.kind;
            return;
        }
        if (header.kind === "retired-unit") {
            this.doc.retired.push({ kind: "unit", line: lineNo, token: header.head });
        }
        this.mode = "body";
        this.node = nodeOf(header, trimmed.slice(HEADER_PREFIX.length), lineNo);
    }

    private handleBareHead(trimmed: string, lineNo: number): boolean {
        if (!BARE_INVARIANT_HEADS.has(trimmed)) {
            return false;
        }
        this.flushInvariant();
        this.doc.retired.push({ kind: "invariant", line: lineNo, token: trimmed });
        this.mode = "bare";
        return true;
    }

    private handleReportHead(trimmed: string, lineNo: number): boolean {
        if (trimmed !== REPORT_HEAD) {
            return false;
        }
        this.flushInvariant();
        this.doc.report = { fields: {}, line: lineNo };
        this.mode = "report";
        return true;
    }

    private handleMode(trimmed: string, lineNo: number): boolean {
        if (this.mode === "invariants") {
            this.consumeInvariantLine(trimmed, lineNo);
            return true;
        }
        if (this.mode === "report") {
            const field = fieldOf(trimmed);
            if (field !== null && this.doc.report) {
                this.doc.report.fields[field.key] = field.value;
            }
            return true;
        }
        return this.mode === "bare" ? trimmed.startsWith(BULLET) : this.mode === "repair";
    }

    private consumeInvariantLine(trimmed: string, lineNo: number): void {
        if (trimmed.startsWith(INVARIANT_PREFIX)) {
            this.flushInvariant();
            this.invariant = { line: lineNo, text: trimmed };
            return;
        }
        if (this.invariant) {
            this.invariant.text = `${this.invariant.text}${WORD_SEPARATOR}${trimmed}`;
        }
    }

    private handleGateLine(trimmed: string, lineNo: number): boolean {
        const marker = gateMarkerOf(trimmed);
        if (marker !== null && this.node) {
            this.gate = { checks: [], line: lineNo, refusal: null, result: null, standing: null };
            if (marker.retired) {
                this.doc.retired.push({ kind: "gate", line: lineNo, token: trimmed });
            }
            this.mode = "gate";
            return true;
        }
        if (this.mode !== "gate" || this.gate === null) {
            return false;
        }
        const step = stepGate(this.gate, trimmed, lineNo);
        this.gate = step.gate;
        if (step.retired !== null) {
            this.doc.retired.push(step.retired);
        }
        this.mode = step.closes ? "body" : this.mode;
        return step.consumed;
    }

    private handleNodeLine(trimmed: string): boolean {
        const { node } = this;
        if (node === null) {
            return false;
        }
        const field = nodeFieldOf(trimmed);
        if (field === null) {
            node.directives.push(trimmed);
        } else {
            node[field.field] = field.value;
        }
        return true;
    }
}

export const parse = function parse(text: string): PagDocument {
    const lines = splitLines(text);
    const front = readFrontmatter(lines);
    const state = new ParseState(front.frontmatter);
    for (let index = front.end; index < lines.length; index += 1) {
        state.consume((lines[index] ?? "").trim(), index + 1);
    }
    state.finish();
    return state.doc;
};
