import type { AstNode } from "./syntax.types.ts";
import type { CheckDeclaration } from "@govlab/context";
import type { Rule } from "eslint";

export type NodeHandler = (node: AstNode, raw: Rule.Node) => void;

export type NodeHandlers = Record<string, NodeHandler>;

export type RuleContext = Rule.RuleContext;
export type RuleListener = Rule.RuleListener;
export type RuleFixer = Rule.RuleFixer;
export type RuleNode = Rule.Node;

export interface LocalRuleMeta extends Omit<Rule.RuleMetaData, "docs"> {
    docs: Rule.RuleMetaData["docs"] & { checks: CheckDeclaration; workspaceWide?: boolean };
}

export interface LocalRule {
    meta: LocalRuleMeta;
    create: (context: RuleContext) => RuleListener;
}

export interface RuleFileShape {
    anyNodes: AstNode[];
    guards: AstNode[];
    ruleObjects: AstNode[];
}

export interface RuleObjectShape {
    meta: AstNode | null;
    metaProperty: AstNode | null;
}
