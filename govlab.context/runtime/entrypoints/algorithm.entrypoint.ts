import { SYMBOLS_ARGV } from "#configuration/configs/invocation.config";
import { SYMBOLS_KEY } from "#configuration/constants/algorithm.constants";
import { buildSymbolIndex } from "#core/converters/algorithm.index.converter";
import { createAlgoGrammar } from "#core/factories/algorithm.factory";
import process from "node:process";
import { resolveArgv } from "@govlab/argv";
import { symbolsGenerated } from "#configuration/strings/ontology.report.strings";
import { symbolsPath } from "#core/loaders/algorithm.loader";
import { writeCanonicalJson } from "@govlab/canonical-write";

resolveArgv(SYMBOLS_ARGV);
const symbols = buildSymbolIndex(createAlgoGrammar({ symbols: [] }).all());
await writeCanonicalJson(symbolsPath(), { [SYMBOLS_KEY]: symbols });
const grammars = new Set(symbols.map((entry) => entry.grammar));
process.stdout.write(`${symbolsGenerated(symbols.length, grammars.size)}\n`);
