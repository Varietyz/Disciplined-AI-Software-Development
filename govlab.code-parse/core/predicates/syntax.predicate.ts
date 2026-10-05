import { COMMENT_NODE_TYPES } from "#configuration/constants/syntax.constants";

export const isCommentType = function isCommentType(type: string): boolean {
    return COMMENT_NODE_TYPES.has(type);
};
