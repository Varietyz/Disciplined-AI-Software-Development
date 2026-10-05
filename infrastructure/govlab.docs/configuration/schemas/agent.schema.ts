import type { FrontmatterSchema } from "#types/metadata.types";

export const AGENT_FRONTMATTER_SCHEMA: FrontmatterSchema = {
    fields: {
        background: { kind: "boolean" },
        color: { enum: ["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"] },
        effort: { enum: ["low", "medium", "high", "xhigh", "max"] },
        isolation: { enum: ["worktree"] },
        maxTurns: { kind: "integer" },
        memory: { enum: ["user", "project", "local"] },
        model: { enum: ["inherit", "sonnet", "opus", "haiku", "fable"] },
        name: { kind: "kebab" },
        permissionMode: { enum: ["default", "manual", "acceptEdits", "auto", "dontAsk", "bypassPermissions", "plan"] },
    },
    required: [],
};
