import { isAlpha, isDigit, isUpperAlpha } from "@govlab/constants";
import type { Rule } from "eslint";
import { SECRET_LABELS } from "#configuration/strings/rule.strings";
import { govlabMeta } from "#core/factories/eslint.factory";

interface AstNode {
    type: string;
    name?: string;
    value?: unknown;
    object?: AstNode;
    property?: AstNode;
    init?: AstNode | null;
    right?: AstNode;
    parent?: AstNode;
}

const DB_SCHEMES = ["mongodb://", "postgres://", "postgresql://", "mysql://", "redis://", "amqp://"];
const SSH_PREFIXES = ["ssh-rsa ", "ssh-ed25519 ", "ssh-dss "];
const SLACK_PREFIXES = ["xoxb-", "xoxp-"];
const MIN_SECRET_LEN = 10;
const SK_MIN = 20;
const GITHUB_MIN = 36;
const GLPAT_MIN = 20;
const SLACK_MIN = 10;
const AWS_MIN = 16;
const BEARER_MIN = 20;
const SCHEME_LEN = 3;

const isAstNode = (value: unknown): value is AstNode => typeof value === "object" && value !== null && "type" in value;

const asNode = (value: unknown): AstNode | null => (isAstNode(value) ? value : null);

const isAlnum = (ch: string): boolean => isAlpha(ch) || isDigit(ch);

interface TailMatcher {
    minRest: number;
    pred: (ch: string) => boolean;
}

const alnumOrDash = (ch: string): boolean => isAlnum(ch) || ch === "-";

const upperOrDigit = (ch: string): boolean => isDigit(ch) || isUpperAlpha(ch);

const tailMatches = (value: string, prefix: string, matcher: TailMatcher): boolean => {
    if (!value.startsWith(prefix)) {
        return false;
    }
    const rest = value.slice(prefix.length);
    if (rest.length < matcher.minRest) {
        return false;
    }
    for (const ch of rest) {
        if (!matcher.pred(ch)) {
            return false;
        }
    }
    return true;
};

const credBoundary = (value: string, authStart: number): number => {
    for (let i = authStart; i < value.length; i += 1) {
        const ch = value[i];
        if (ch === "/" || ch === "?" || ch === "#") {
            return i;
        }
    }
    return value.length;
};

const authorityHasCreds = (value: string, authStart: number): boolean => {
    const authority = value.slice(authStart, credBoundary(value, authStart));
    const at = authority.indexOf("@");
    if (at === -1) {
        return false;
    }
    const colon = authority.indexOf(":");
    return colon !== -1 && colon < at;
};

const hasEmbeddedCreds = (value: string): boolean => {
    let from = value.indexOf("://");
    while (from >= 1) {
        if (authorityHasCreds(value, from + SCHEME_LEN)) {
            return true;
        }
        from = value.indexOf("://", from + SCHEME_LEN);
    }
    return false;
};

const PREFIX_TOKENS: { label: string; matcher: TailMatcher; prefixes: string[] }[] = [
    { label: SECRET_LABELS.openai, matcher: { minRest: SK_MIN, pred: isAlnum }, prefixes: ["sk-"] },
    { label: SECRET_LABELS.github, matcher: { minRest: GITHUB_MIN, pred: isAlnum }, prefixes: ["ghp_", "gho_"] },
    { label: SECRET_LABELS.gitlab, matcher: { minRest: GLPAT_MIN, pred: alnumOrDash }, prefixes: ["glpat-"] },
    { label: SECRET_LABELS.slack, matcher: { minRest: SLACK_MIN, pred: alnumOrDash }, prefixes: SLACK_PREFIXES },
    { label: SECRET_LABELS.awsKey, matcher: { minRest: AWS_MIN, pred: upperOrDigit }, prefixes: ["AKIA"] },
];

const isPrefixedToken = (value: string): string | null => {
    const hit = PREFIX_TOKENS.find((token) =>
        token.prefixes.some((prefix) => tailMatches(value, prefix, token.matcher)),
    );
    return hit ? hit.label : null;
};

const SECRET_CHECKS: { label: string; test: (value: string) => boolean }[] = [
    { label: SECRET_LABELS.privateKey, test: (value) => value.includes("-----BEGIN") && value.includes("PRIVATE KEY") },
    { label: SECRET_LABELS.database, test: (value) => DB_SCHEMES.some((scheme) => value.startsWith(scheme)) },
    { label: SECRET_LABELS.sshKey, test: (value) => SSH_PREFIXES.some((prefix) => value.startsWith(prefix)) },
    { label: SECRET_LABELS.bearer, test: (value) => value.startsWith("Bearer ") && value.length > BEARER_MIN },
    { label: SECRET_LABELS.credentialedUrl, test: hasEmbeddedCreds },
];

const matchSecretPattern = (value: string): string | null => {
    if (value.length < MIN_SECRET_LEN) {
        return null;
    }
    const prefixed = isPrefixedToken(value);
    if (prefixed !== null) {
        return prefixed;
    }
    const hit = SECRET_CHECKS.find((check) => check.test(value));
    return hit ? hit.label : null;
};

const secretLabel = (value: unknown): string | null => {
    const node = asNode(value);
    if (node?.type !== "Literal" || typeof node.value !== "string") {
        return null;
    }
    return matchSecretPattern(node.value);
};

const isTestFile = (filename: string): boolean => filename.split("\\").join("/").includes("/tests/");

const reportSecret = function reportSecret(context: Rule.RuleContext, node: Rule.Node, valueField: unknown): void {
    const label = secretLabel(valueField);
    if (label !== null) {
        context.report({ data: { label }, messageId: "secretValueDetected", node });
    }
};

const onAssignment = function onAssignment(context: Rule.RuleContext, node: Rule.Node): void {
    if (node.type === "AssignmentExpression") {
        reportSecret(context, node, node.right);
    }
};

const onProperty = function onProperty(context: Rule.RuleContext, node: Rule.Node): void {
    if (node.type === "Property" && node.parent.type === "ObjectExpression") {
        reportSecret(context, node, node.value);
    }
};

const onVariableDeclarator = function onVariableDeclarator(context: Rule.RuleContext, node: Rule.Node): void {
    if (node.type === "VariableDeclarator") {
        reportSecret(context, node, node.init);
    }
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        if (isTestFile(context.filename)) {
            return {};
        }
        const assignment = (node: Rule.Node): void => {
            onAssignment(context, node);
        };
        const property = (node: Rule.Node): void => {
            onProperty(context, node);
        };
        const variable = (node: Rule.Node): void => {
            onVariableDeclarator(context, node);
        };
        const handlers: [string, (node: Rule.Node) => void][] = [
            ["AssignmentExpression", assignment],
            ["Property", property],
            ["VariableDeclarator", variable],
        ];
        return Object.fromEntries(handlers);
    },
    meta: govlabMeta({
        canonical: ["hardcoded-secret", "credentials"],
        description: "Disallow hardcoded secrets, API keys, tokens, private keys, and credential URLs",
        messages: {
            secretValueDetected:
                "Hardcoded {{label}} detected. Move it to .env and reference it via the config layer / process.env — never commit a live credential.",
        },
        ruleId: "env_only_secrets",
    }),
} satisfies Rule.RuleModule;
