import type { ScriptEdge, ScriptGraph, ScriptNode, ScriptNodeKind } from "#types/graph.types";
import { tokenizeCommand } from "#core/lexers/shell.lexer";

const OPERATORS: ReadonlySet<string> = new Set(["&&", "||", "|", ";", "&"]);
const RUN_ALL: ReadonlySet<string> = new Set(["run-s", "run-p", "npm-run-all", "run-s.cmd", "run-p.cmd"]);
const PACKAGE_RUNNERS: ReadonlySet<string> = new Set(["npm", "pnpm", "yarn", "bun", "npm.cmd", "pnpm.cmd", "yarn.cmd"]);
const FILE_RUNNERS: ReadonlySet<string> = new Set(["node", "tsx", "ts-node", "nodemon", "electron"]);
const RUN_WORD = "run";
const FLAG_PREFIX = "-";
const RUN_REF_OFFSET = 2;

class ScriptGraphBuilder {
    private readonly nodes = new Map<string, ScriptNode>();
    private readonly edges = new Map<string, ScriptEdge>();

    public build(scripts: Readonly<Record<string, string>>): ScriptGraph {
        for (const [name, command] of Object.entries(scripts)) {
            this.addNode(`script:${name}`, name, "script");
            this.scan(`script:${name}`, command);
        }
        return {
            edges: [...this.edges.values()].toSorted((left, right) =>
                `${left.from} ${left.to}`.localeCompare(`${right.from} ${right.to}`),
            ),
            nodes: [...this.nodes.values()].toSorted((left, right) => left.id.localeCompare(right.id)),
        };
    }

    private addNode(id: string, label: string, kind: ScriptNodeKind): void {
        if (!this.nodes.has(id)) {
            this.nodes.set(id, { id, kind, label });
        }
    }

    private link(owner: string, kind: ScriptNodeKind, label: string): void {
        const id = `${kind}:${label}`;
        this.addNode(id, label, kind);
        const key = `${owner} ${id}`;
        if (!this.edges.has(key)) {
            this.edges.set(key, { from: owner, to: id });
        }
    }

    private scan(owner: string, command: string): void {
        const words = tokenizeCommand(command);
        let at = 0;
        while (at < words.length) {
            at = this.scanWord(owner, words, at);
        }
    }

    private scanWord(owner: string, words: readonly string[], at: number): number {
        const word = words[at] ?? "";
        if (word.includes(" ")) {
            this.scan(owner, word);
            return at + 1;
        }
        if (OPERATORS.has(word)) {
            return at + 1;
        }
        return (
            this.tryPackageRun(owner, words, at) ??
            this.tryRunAll(owner, words, at) ??
            this.tryFileRun(owner, words, at) ??
            this.tryTool(owner, words, at)
        );
    }

    private tryPackageRun(owner: string, words: readonly string[], at: number): number | null {
        const isRun = PACKAGE_RUNNERS.has(words[at] ?? "") && words[at + 1] === RUN_WORD;
        if (!isRun || at + RUN_REF_OFFSET >= words.length) {
            return null;
        }
        this.link(owner, "script", words[at + RUN_REF_OFFSET] ?? "");
        return at + RUN_REF_OFFSET;
    }

    private tryRunAll(owner: string, words: readonly string[], at: number): number | null {
        if (!RUN_ALL.has(words[at] ?? "")) {
            return null;
        }
        for (const word of words.slice(at + 1)) {
            if (OPERATORS.has(word)) {
                break;
            }
            if (!word.startsWith(FLAG_PREFIX)) {
                this.link(owner, "script", word);
            }
        }
        return at + 1;
    }

    private tryFileRun(owner: string, words: readonly string[], at: number): number | null {
        const next = words[at + 1] ?? "";
        if (!FILE_RUNNERS.has(words[at] ?? "") || at + 1 >= words.length || next.startsWith(FLAG_PREFIX)) {
            return null;
        }
        this.link(owner, "file", next);
        return at + RUN_REF_OFFSET;
    }

    private tryTool(owner: string, words: readonly string[], at: number): number {
        const head = words[at] ?? "";
        if (at === 0 && !head.startsWith(FLAG_PREFIX)) {
            this.link(owner, "tool", head);
        }
        return at + 1;
    }
}

export const scriptLifecycle = function scriptLifecycle(scripts: Readonly<Record<string, string>>): ScriptGraph {
    return new ScriptGraphBuilder().build(scripts);
};
