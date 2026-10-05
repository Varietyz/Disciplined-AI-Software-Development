import {
    COMMENT_MODES,
    DEFAULT_COMMENT_MODE,
    EXTRACT_MODE,
    FAILURE_EXIT,
    FLAGS,
    KEEP_MODE,
    LIST_SEPARATOR,
} from "#configuration/constants/invocation.constants";
import { commentFailure, keepModeLine, modeLine } from "#configuration/strings/comment.strings";
import { flagValue, resolveArgv } from "@govlab/argv";
import { runExtract, runStrip } from "#core/coordinators/comment.coordinator";
import { COMMENT_ARGV } from "#configuration/configs/invocation.config";
import { loadGovlabConfig } from "#core/loaders/config.loader";
import { masterExcludeMarkers } from "#core/selectors/exclusions.selector";
import path from "node:path";
import { pathExclusion } from "#core/matchers/exclusions.matcher";
import process from "node:process";

const argv = resolveArgv(COMMENT_ARGV);
const workspace = process.cwd();
const requested = flagValue(argv, FLAGS.mode) ?? DEFAULT_COMMENT_MODE;
const mode = COMMENT_MODES.has(requested) ? requested : DEFAULT_COMMENT_MODE;
const [rootArg] = argv.positionals;
const root = rootArg === undefined ? workspace : path.resolve(rootArg);

const run = async function run(): Promise<void> {
    if (mode === KEEP_MODE) {
        process.stdout.write(keepModeLine);
        return;
    }
    process.stdout.write(modeLine(mode, root));
    const ignore = (flagValue(argv, FLAGS.ignore) ?? "").split(LIST_SEPARATOR).filter((entry) => entry.length > 0);
    const markers = masterExcludeMarkers(await loadGovlabConfig(workspace), "comments");
    const excluded = pathExclusion(workspace, [...markers, ...ignore]);
    await (mode === EXTRACT_MODE
        ? runExtract(root, flagValue(argv, FLAGS.out) ?? null, excluded)
        : runStrip(root, excluded));
};

await run().catch((error: unknown) => {
    process.stderr.write(commentFailure(error instanceof Error ? error.message : String(error)));
    process.exitCode = FAILURE_EXIT;
});
