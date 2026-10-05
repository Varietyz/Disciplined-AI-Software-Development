export {
    writeCanonicalJson,
    writeCanonicalText,
    writeGeneratedMarkdown,
    writeVerbatim,
} from "./core/persistence/text.persistence.ts";
export { GENERATED_MARK_PREFIX } from "./configuration/constants/mark.constants.ts";
export { composeMark, markTimeOf, stampGenerated, stripMark } from "./core/formatters/mark.formatter.ts";
export { parseMark } from "./core/selectors/mark.selector.ts";
export type { GeneratedMark } from "./types/mark.types.ts";
