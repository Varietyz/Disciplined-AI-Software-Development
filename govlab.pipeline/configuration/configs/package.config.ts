import type { Member } from "#types/stage.types";
import { relativePath } from "@ssot/paths";

const GATED = true;
const ON_DEMAND = false;

const suiteMember = function suiteMember(id: string, key: string, tests: string): Member {
    return {
        dir: relativePath(key),
        gated: ON_DEMAND,
        id,
        tests: `${relativePath("codebase.testing.govlab")}/${tests}`,
    };
};

export const MEMBERS: readonly Member[] = [
    { dir: relativePath("project.paths"), gated: GATED, id: "paths", tests: relativePath("codebase.testing.paths") },
    {
        dir: relativePath("project.scripts"),
        gated: GATED,
        id: "scripts",
        tests: relativePath("codebase.testing.scripts"),
    },
    {
        dir: relativePath("project.secrets"),
        gated: GATED,
        id: "secrets",
        tests: relativePath("codebase.testing.secrets"),
    },
    { dir: relativePath("codebase.testing"), gated: GATED, id: "testing", tests: null },
    { dir: relativePath("app.member"), gated: GATED, id: "app", tests: relativePath("codebase.testing.app") },
    { dir: relativePath("app.deploy"), gated: GATED, id: "deploy", tests: relativePath("codebase.testing.deploy") },
    { dir: relativePath("app.content"), gated: GATED, id: "content", tests: relativePath("codebase.testing.content") },
    { dir: relativePath("app.social"), gated: GATED, id: "social", tests: relativePath("codebase.testing.social") },
    { dir: relativePath("app.build"), gated: GATED, id: "build", tests: relativePath("codebase.testing.build") },
    {
        dir: relativePath("app.coordination"),
        gated: GATED,
        id: "coordination",
        tests: relativePath("codebase.testing.coordination"),
    },
    { dir: relativePath("app.server"), gated: GATED, id: "server", tests: relativePath("codebase.testing.server") },
    { dir: relativePath("govlabHost"), gated: GATED, id: "rules", tests: relativePath("codebase.testing.rules") },
    suiteMember("constants", "govlab.constants", "constants"),
    suiteMember("context", "govlab.context", "context"),
    suiteMember("docs", "govlab.docs", "docs"),
    suiteMember("patterns", "govlab.patterns", "patterns"),
    suiteMember("pipeline", "govlab.pipeline", "pipeline"),
    suiteMember("quality", "govlab.quality", "quality"),
    suiteMember("stats", "govlab.stats", "stats"),
    suiteMember("argv", "govlab.utils.argv", "argv"),
    suiteMember("canonical-write", "govlab.utils.canonicalWrite", "canonical-write"),
    suiteMember("code-parse", "govlab.utils.codeParse", "code-parse"),
    suiteMember("content-fingerprint", "govlab.utils.contentFingerprint", "content-fingerprint"),
];
