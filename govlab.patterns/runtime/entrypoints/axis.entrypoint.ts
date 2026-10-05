import { createGovlabContext, patternVocabularyOf } from "@govlab/context";
import { AXIS_ARGV } from "#configuration/configs/invocation.config";
import { absolutePath } from "@ssot/paths";
import { axisGenerated } from "#configuration/strings/axis.strings";
import { basename } from "node:path";
import process from "node:process";
import { resolveArgv } from "@govlab/argv";
import { writeCanonicalText } from "@govlab/canonical-write";

resolveArgv(AXIS_ARGV);

const vocabulary = patternVocabularyOf(createGovlabContext().reason);
const lists: readonly (readonly [string, readonly string[]])[] = [
    ["ONTOLOGY_AXIS", vocabulary.ontology],
    ["ANALYSIS_AXIS", vocabulary.analysis],
    ["REPRESENTATION_AXIS", vocabulary.representation],
    ["REASONING_AXIS", vocabulary.reasoning],
    ["MATH_TYPE_AXIS", vocabulary.mathTypes],
];
const text = lists.map(([name, values]) => `export const ${name} = ${JSON.stringify(values)} as const;\n`).join("\n");
const target = absolutePath("govlab.patterns.axis");
await writeCanonicalText(target, text);
const counts = lists.map(([name, values]) => `${name} ${values.length}`).join(", ");
process.stdout.write(axisGenerated(basename(target), counts));
