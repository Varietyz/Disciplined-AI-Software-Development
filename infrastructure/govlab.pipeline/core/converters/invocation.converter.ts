import { GATE_FLAGS, LIST_SEPARATOR } from "#configuration/constants/stage.constants";
import { type ParsedArgv, flagValues, hasFlag } from "@govlab/argv";
import type { StageArgs } from "#types/stage.types";

const listOf = function listOf(argv: ParsedArgv, flag: string): Set<string> {
    return new Set(
        flagValues(argv, flag)
            .flatMap((value) => value.split(LIST_SEPARATOR))
            .map((entry) => entry.trim())
            .filter((entry) => entry.length > 0),
    );
};

export const stageArgsOf = function stageArgsOf(argv: ParsedArgv): StageArgs {
    return {
        bypass: listOf(argv, GATE_FLAGS.bypass),
        members: listOf(argv, GATE_FLAGS.member),
        only: listOf(argv, GATE_FLAGS.only),
        report: hasFlag(argv, GATE_FLAGS.report),
        run: listOf(argv, GATE_FLAGS.run),
        skipTags: listOf(argv, GATE_FLAGS.skipTag),
        tags: listOf(argv, GATE_FLAGS.tag),
    };
};
