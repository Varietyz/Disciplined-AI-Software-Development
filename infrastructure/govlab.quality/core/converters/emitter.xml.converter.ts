import type { ActiveConcept, EmitDescriptor, XmlElement } from "#types/emitter.types";
import { hasValue, ownerRuleId } from "#core/converters/emitter.converter";

const scalarString = function scalarString(value: unknown): string {
    if (typeof value === "string") {
        return value;
    }
    return typeof value === "number" || typeof value === "boolean" ? String(value) : "";
};

const valueProp = function valueProp(concept: ActiveConcept): XmlElement[] {
    return hasValue(concept)
        ? [{ attrs: { name: concept.knob, value: scalarString(concept.value) }, tag: "property" }]
        : [];
};

const ruleElement = function ruleElement(descriptor: EmitDescriptor, concept: ActiveConcept): XmlElement {
    const props = valueProp(concept);
    const name = props.length > 0 ? ownerRuleId(concept.canonicalId, concept.ruleIds) : (concept.ruleIds[0] ?? "");
    const wrap = descriptor.xmlPropsWrap;
    const children = typeof wrap === "string" && props.length > 0 ? [{ children: props, tag: wrap }] : props;
    const ref = `${descriptor.xmlRefPrefix ?? ""}${name}`;
    return { attrs: { [descriptor.xmlNameAttr ?? "name"]: ref }, children, tag: descriptor.xmlRuleTag ?? "module" };
};

export const xmlRulesetTree = function xmlRulesetTree(
    descriptor: EmitDescriptor,
    concepts: ActiveConcept[],
): XmlElement {
    const rules = concepts.map((concept) => ruleElement(descriptor, concept));
    const description = descriptor.xmlDescription;
    const leading: XmlElement[] =
        typeof description === "string" && description.length > 0 ? [{ tag: "description", text: description }] : [];
    const wraps = descriptor.xmlWrap ?? [{ tag: "ruleset" }];
    const nested = wraps.reduceRight<XmlElement[]>(
        (level, wrap) => [{ attrs: wrap.attrs, children: level, tag: wrap.tag }],
        [...leading, ...rules],
    );
    return nested[0] ?? { tag: "ruleset" };
};
