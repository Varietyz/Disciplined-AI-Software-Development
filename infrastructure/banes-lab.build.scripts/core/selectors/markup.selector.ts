import type { Attribute, Tag } from "#types/markup.types";

export const attributeOf = function attributeOf(tag: Tag, name: string): Attribute | undefined {
    return tag.attributes.find((attribute) => attribute.name === name);
};
