import {
    BYPASS_FLAG,
    GATE_COMMAND,
    GATE_SUMMARY,
    MEMBER_FLAG,
    ONLY_FLAG,
    REPORT_FLAG,
    RUN_FLAG,
    SKIP_TAG_FLAG,
    TAG_FLAG,
} from "#configuration/strings/invocation.strings";
import type { ArgvSpec } from "@govlab/argv";
import { GATE_FLAGS } from "#configuration/constants/stage.constants";

export const GATE_ARGV: ArgvSpec = {
    command: GATE_COMMAND,
    flags: [
        { describe: BYPASS_FLAG, name: GATE_FLAGS.bypass, repeatable: true, takesValue: true },
        { describe: RUN_FLAG, name: GATE_FLAGS.run, repeatable: true, takesValue: true },
        { describe: MEMBER_FLAG, name: GATE_FLAGS.member, repeatable: true, takesValue: true },
        { describe: ONLY_FLAG, name: GATE_FLAGS.only, repeatable: true, takesValue: true },
        { describe: TAG_FLAG, name: GATE_FLAGS.tag, repeatable: true, takesValue: true },
        { describe: SKIP_TAG_FLAG, name: GATE_FLAGS.skipTag, repeatable: true, takesValue: true },
        { describe: REPORT_FLAG, name: GATE_FLAGS.report, repeatable: true, takesValue: false },
    ],
    summary: GATE_SUMMARY,
};
