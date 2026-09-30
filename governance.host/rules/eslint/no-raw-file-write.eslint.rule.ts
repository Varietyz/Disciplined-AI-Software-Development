import type { InitResolver, WriteNode, WriteOwnership, WriteSite } from "../../types/generator.types.ts";
import { WRITER_FUNCTIONS, WRITE_OWNER_MODULES } from "../../shared/manifests/generator.manifest.ts";
import { WRITER_OPTIONS_SCHEMA, declaredModules, declaredWriters } from "../../shared/allowlists/factory.allowlist.ts";
import { asWriteNode, variableInit } from "../../shared/resolvers/scope.resolver.ts";
import {
    calledName,
    isFileWriteCall,
    isJsonStringify,
    parentWriteMissingUtf8,
} from "../../shared/analyzers/sink.analyzer.ts";
import { rootsAtEphemeralDir, targetIsUnmarkedGenerated } from "../../shared/analyzers/generator.analyzer.ts";
import type { Rule } from "eslint";
import { basenameOf } from "../../shared/resolvers/anchor.resolver.ts";
import { defineCheck } from "@govlab/context/check";
import { governsOwnWrites } from "../../shared/resolvers/location.resolver.ts";

defineCheck({ detects: [], enforces: ["architecture:idempotency", "architecture:determinism"] });

const REQUIRED_SPACING = 4;
const SPACING_ARG_INDEX = 2;

const TAG = "[no_raw_file_write]";

const BYPASS = `A file is written through the raw file-write primitive outside the module that owns file writes, so the write skips what the owner guarantees: generated output lands in canonical bytes, and a verbatim write never lands on a file marked as generated. Write through the owner's API, or declare this module as an owner when it is the one place its member writes files. ${TAG}`;

const ENCODING = `File write of JSON.stringify output is missing utf-8 encoding. Pass "utf-8" to the write call so the file is encoded deterministically. ${TAG}`;

const MARKER = `A generated file written to a formatter-supported path carries no generated marker in its filename. Output produced by code carries the marker, so the tooling can find it and the developer never edits it by hand, and the conventional readme is the one exception. Rename the write target so the marker comes before its extension. ${TAG}`;

const SPACING = `JSON.stringify indent is {{spacing}}, not 4. Use JSON.stringify(value, null, 4) so serialized output is consistent across the codebase. ${TAG}`;

const reportSpacing = function reportSpacing(context: Rule.RuleContext, call: WriteNode, node: Rule.Node): void {
    const third = call.arguments?.[SPACING_ARG_INDEX];
    const spacing = third?.type === "Literal" && typeof third.value === "number" ? third.value : null;
    if (spacing === null) {
        return;
    }
    if (spacing !== REQUIRED_SPACING) {
        context.report({ data: { spacing: String(spacing) }, messageId: "spacing", node });
        return;
    }
    if (parentWriteMissingUtf8(call)) {
        context.report({ messageId: "encoding", node });
    }
};

const reportWrite = function reportWrite(context: Rule.RuleContext, ownership: WriteOwnership, site: WriteSite): void {
    const primitive = isFileWriteCall(site.call);
    if (!primitive && !ownership.writers.has(calledName(site.call) ?? "")) {
        return;
    }
    const target = site.call.arguments?.[0];
    if (!target) {
        return;
    }
    const resolve: InitResolver = (name) => variableInit(context, site.node, name);
    if (rootsAtEphemeralDir(resolve, target, 0)) {
        return;
    }
    if (primitive && !ownership.owner) {
        context.report({ messageId: "bypass", node: site.node });
        return;
    }
    if (targetIsUnmarkedGenerated(resolve, target)) {
        context.report({ messageId: "marker", node: site.node });
    }
};

const handleCall = function handleCall(context: Rule.RuleContext, ownership: WriteOwnership, node: Rule.Node): void {
    const call = asWriteNode(node);
    if (call === null) {
        return;
    }
    if (isJsonStringify(call)) {
        reportSpacing(context, call, node);
        return;
    }
    reportWrite(context, ownership, { call, node });
};

const rule: Rule.RuleModule = {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const ownership: WriteOwnership = {
            owner:
                declaredModules(context, WRITE_OWNER_MODULES).has(basenameOf(context.filename)) ||
                governsOwnWrites(context.filename),
            writers: declaredWriters(context, WRITER_FUNCTIONS),
        };
        const handlers: [string, (node: Rule.Node) => void][] = [
            [
                "CallExpression",
                (node): void => {
                    handleCall(context, ownership, node);
                },
            ],
        ];
        return Object.fromEntries(handlers);
    },
    meta: {
        docs: {
            description:
                "Every file write goes through the module that owns file writes, and the raw file-write primitive is banned everywhere else. The owner writes generated output in canonical bytes and refuses a verbatim write to a file marked as generated, so a write helper cannot carry output past the check. A formatter-supported output path carries the generated marker, and serialized JSON keeps one indent and one encoding. Which modules own writes, and which of their functions write, is data in the rule's options. A self-governed member whose manifest names an existing write gate governs its own raw writes.",
        },
        messages: { bypass: BYPASS, encoding: ENCODING, marker: MARKER, spacing: SPACING },
        schema: WRITER_OPTIONS_SCHEMA,
        type: "problem",
    },
};

export default { plugins: { "govlab-write": { rules: { "no-raw-file-write": rule } } }, tool: "eslint" };
